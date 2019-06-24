pragma solidity 0.5.6;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-proxy-contracts/src/contracts/iproxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-create-proxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-update-proxy.sol";
import "./xcert-custom.sol";

/**
 * @dev Decentralize exchange, creating, updating and other actions for fundgible and non-fundgible
 * tokens powered by atomic swaps.
 */
contract DeployGateway
{

  /**
   * @dev Error constants.
   */
  string constant INVALID_SIGNATURE_KIND = "009001";
  string constant TAKER_NOT_EQUAL_TO_SENDER = "009002";
  string constant CLAIM_EXPIRED = "009003";
  string constant INVALID_SIGNATURE = "009004";
  string constant ORDER_CANCELED = "009005";
  string constant ORDER_ALREADY_PERFORMED = "009006";
  string constant MAKER_NOT_EQUAL_TO_SENDER = "009007";

  /**
   * @dev Enum of available signature kinds.
   * @param eth_sign Signature using eth sign.
   * @param trezor Signature from Trezor hardware wallet.
   * It differs from web3.eth_sign in the encoding of message length
   * (Bitcoin varint encoding vs ascii-decimal, the latter is not
   * self-terminating which leads to ambiguities).
   * See also:
   * https://en.bitcoin.it/wiki/Protocol_documentation#Variable_length_integer
   * https://github.com/trezor/trezor-mcu/blob/master/firmware/ethereum.c#L602
   * https://github.com/trezor/trezor-mcu/blob/master/firmware/crypto.c#L36a
   * @param eip721 Signature using eip721.
   */
  enum SignatureKind
  {
    eth_sign,
    trezor,
    eip712
  }

  /**
   * Data needed to deploy a new Xcert smart contract.
   */
  struct DeployData
  {
    string name;
    string symbol;
    string uriBase;
    bytes32 schemaId;
    bytes4[] capabilities;
    address owner;
  }

  /**
   * Data needed to transfer tokens.
   */
  struct TransferData
  {
    address token;
    address to;
    uint256 value;
  }

  /**
   * @dev Structure representing the signature parts.
   * @param r ECDSA signature parameter r.
   * @param s ECDSA signature parameter s.
   * @param v ECDSA signature parameter v.
   * @param kind Type of signature.
   */
  struct SignatureData
  {
    bytes32 r;
    bytes32 s;
    uint8 v;
    SignatureKind kind;
  }

  /**
   * @dev Structure representing the data needed to do the order.
   * @param maker Address of the one that made the claim.
   * @param taker Address of the one that is executing the claim.
   * @param deployData Data needed to deploy a new Xcert smart contract.
   * @param transferData Data needed to transfer tokens.
   * @param signature Data from the signed claim.
   * @param seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param expiration Timestamp of when the claim expires. 0 if indefinet.
   */
  struct OrderData
  {
    address maker;
    address taker;
    DeployData deployData;
    TransferData transferData;
    uint256 seed;
    uint256 expiration;
  }

  /**
   * @dev Address of token transfer proxy.
   */
  address public tokenTransferProxy;

  /**
   * @dev Address of asset create proxy.
   */
  address public assetCreateProxy;

  /**
   * @dev Mapping of all cancelled orders.
   */
  mapping(bytes32 => bool) public orderCancelled;

  /**
   * @dev Mapping of all performed orders.
   */
  mapping(bytes32 => bool) public orderPerformed;

  /**
   * @dev This event emmits when tokens change ownership.
   */
  event Perform(
    address indexed _maker,
    address indexed _taker,
    address _createdContract,
    bytes32 _claim
  );

  /**
   * @dev This event emmits when transfer order is cancelled.
   */
  event Cancel(
    address indexed _maker,
    address indexed _taker,
    bytes32 _claim
  );

  /**
   * @dev Constructor sets token transfer proxy address.
   * @param _tokenTransferProxy Address of token transfer proxy.
   */
  constructor(
    address _tokenTransferProxy,
    address _assetCreateProxy
  )
    public
  {
    tokenTransferProxy = _tokenTransferProxy;
    assetCreateProxy = _assetCreateProxy;
  }
  
  /**
   * @dev Performs the atomic swap that deploys a new Xcert smart contract and at the same time
   * transfers tokens.
   * @param _data Data required to make the order.
   * @param _signature Data from the signature.
   */
  function perform(
    OrderData memory _data,
    SignatureData memory _signature
  )
    public
  {
    require(_data.taker == msg.sender, TAKER_NOT_EQUAL_TO_SENDER);
    require(_data.expiration >= now, CLAIM_EXPIRED);

    bytes32 claim = getOrderDataClaim(_data);
    require(
      isValidSignature(
        _data.maker,
        claim,
        _signature
      ),
      INVALID_SIGNATURE
    );

    require(!orderCancelled[claim], ORDER_CANCELED);
    require(!orderPerformed[claim], ORDER_ALREADY_PERFORMED);

    orderPerformed[claim] = true;

    address xcert = _doActions(_data);

    emit Perform(
      _data.maker,
      _data.taker,
      xcert,
      claim
    );
  }

  /**
   * @dev @dev Performs the atomic swap that deploys a new Xcert smart contract and at the same time
   * transfers tokens where performing address does not need to be known before
   * hand.
   * @notice When using this function, be aware that the zero address is reserved for replacement
   * with msg.sender, meaning you cannot send anything to the zero address.
   * @param _data Data required to make the order.
   * @param _signature Data from the signature.
   */
  function performAnyTaker(
    OrderData memory _data,
    SignatureData memory _signature
  )
    public
  {
    require(_data.expiration >= now, CLAIM_EXPIRED);

    bytes32 claim = getOrderDataClaim(_data);
    require(
      isValidSignature(
        _data.maker,
        claim,
        _signature
      ),
      INVALID_SIGNATURE
    );

    require(!orderCancelled[claim], ORDER_CANCELED);
    require(!orderPerformed[claim], ORDER_ALREADY_PERFORMED);

    orderPerformed[claim] = true;

    address xcert = _doActions(_data);

    emit Perform(
      _data.maker,
      msg.sender,
      xcert,
      claim
    );
  }

  /**
   * @dev Cancels order.
   * @notice You can cancel the same order multiple times. There is no check for whether the order
   * was already canceled due to gas optimization. You should either check orderCancelled variable
   * or listen to Cancel event if you want to check if an order is already canceled.
   * @param _data Data of order to cancel.
   */
  function cancel(
    OrderData memory _data
  )
    public
  {
    require(_data.maker == msg.sender, MAKER_NOT_EQUAL_TO_SENDER);

    bytes32 claim = getOrderDataClaim(_data);
    require(!orderPerformed[claim], ORDER_ALREADY_PERFORMED);

    orderCancelled[claim] = true;
    emit Cancel(
      _data.maker,
      _data.taker,
      claim
    );
  }

  /**
   * @dev Calculates keccak-256 hash of OrderData from parameters.
   * @param _orderData Data needed for atomic swap.
   * @return keccak-hash of order data.
   */
  function getOrderDataClaim(
    OrderData memory _orderData
  )
    public
    view
    returns (bytes32)
  {
    bytes32 deployData = keccak256(
      abi.encodePacked(
        _orderData.deployData.name,
        _orderData.deployData.symbol,
        _orderData.deployData.uriBase,
        _orderData.deployData.schemaId,
        _orderData.deployData.capabilities,
        _orderData.deployData.owner
      )
    );

    bytes32 transferData = keccak256(
      abi.encodePacked(
        _orderData.transferData.token,
        _orderData.transferData.to,
        _orderData.transferData.value
      )
    );

    return keccak256(
      abi.encodePacked(
        address(this),
        _orderData.maker,
        _orderData.taker,
        deployData,
        transferData,
        _orderData.seed,
        _orderData.expiration
      )
    );
  }

  /**
   * @dev Verifies if claim signature is valid.
   * @param _signer address of signer.
   * @param _claim Signed Keccak-256 hash.
   * @param _signature Signature data.
   */
  function isValidSignature(
    address _signer,
    bytes32 _claim,
    SignatureData memory _signature
  )
    public
    pure
    returns (bool)
  {
    if (_signature.kind == SignatureKind.eth_sign)
    {
      return _signer == ecrecover(
        keccak256(
          abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            _claim
          )
        ),
        _signature.v,
        _signature.r,
        _signature.s
      );
    } else if (_signature.kind == SignatureKind.trezor)
    {
      return _signer == ecrecover(
        keccak256(
          abi.encodePacked(
            "\x19Ethereum Signed Message:\n\x20",
            _claim
          )
        ),
        _signature.v,
        _signature.r,
        _signature.s
      );
    } else if (_signature.kind == SignatureKind.eip712)
    {
      return _signer == ecrecover(
        _claim,
        _signature.v,
        _signature.r,
        _signature.s
      );
    }

    revert(INVALID_SIGNATURE_KIND);
  }

  /**
   * @dev Helper function that makes order actions.
   * @param _order Data needed for order.
   */
  function _doActions(
    OrderData memory _order
  )
    private
    returns (address _xcert)
  {
    Proxy(tokenTransferProxy).execute(
      _order.transferData.token,
      _order.maker,
      _order.transferData.to,
      _order.transferData.value
    );

    _xcert = address(
        new XcertCustom(
        _order.deployData.name,
        _order.deployData.symbol,
        _order.deployData.uriBase,
        _order.deployData.schemaId,
        _order.deployData.capabilities,
        _order.deployData.owner,
        assetCreateProxy
      )
    );
  }
}
