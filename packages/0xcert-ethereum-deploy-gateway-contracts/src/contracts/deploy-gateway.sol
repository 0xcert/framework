pragma solidity 0.5.6;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-proxy-contracts/src/contracts/iproxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-create-proxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-update-proxy.sol";
import "./xcert-custom.sol";

/**
 * @dev Atomic deploy of a new Xcert (non fungible) smart contract with a token transfer.
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
  string constant DEPLOY_CANCELED = "009005";
  string constant DEPLOY_ALREADY_PERFORMED = "009006";
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
  struct XcertData
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
   * @dev Structure representing the data needed to do the deploy.
   * @param maker Address of the one that made the claim.
   * @param taker Address of the one that is executing the claim.
   * @param xcertData Data needed to deploy a new Xcert smart contract.
   * @param transferData Data needed to transfer tokens.
   * @param signature Data from the signed claim.
   * @param seed Arbitrary number to facilitate uniqueness of the deploy's hash. Usually timestamp.
   * @param expiration Timestamp of when the claim expires. 0 if indefinite.
   */
  struct DeployData
  {
    address maker;
    address taker;
    XcertData xcertData;
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
   * @dev Mapping of all cancelled deploys.
   */
  mapping(bytes32 => bool) public deployCancelled;

  /**
   * @dev Mapping of all performed deploys.
   */
  mapping(bytes32 => bool) public deployPerformed;

  /**
   * @dev This event emmits when deploy is performed.
   */
  event Perform(
    address indexed _maker,
    address indexed _taker,
    address _createdContract,
    bytes32 _claim
  );

  /**
   * @dev This event emmits when deploy is cancelled.
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
   * @param _data Data required to make the deploy.
   * @param _signature Data from the signature.
   */
  function perform(
    DeployData memory _data,
    SignatureData memory _signature
  )
    public
  {
    require(_data.taker == msg.sender, TAKER_NOT_EQUAL_TO_SENDER);
    require(_data.expiration >= now, CLAIM_EXPIRED);

    bytes32 claim = getDeployDataClaim(_data);
    require(
      isValidSignature(
        _data.maker,
        claim,
        _signature
      ),
      INVALID_SIGNATURE
    );

    require(!deployCancelled[claim], DEPLOY_CANCELED);
    require(!deployPerformed[claim], DEPLOY_ALREADY_PERFORMED);

    deployPerformed[claim] = true;

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
   * @param _data Data required to make the deploy.
   * @param _signature Data from the signature.
   */
  function performAnyTaker(
    DeployData memory _data,
    SignatureData memory _signature
  )
    public
  {
    require(_data.expiration >= now, CLAIM_EXPIRED);

    bytes32 claim = getDeployDataClaim(_data);
    require(
      isValidSignature(
        _data.maker,
        claim,
        _signature
      ),
      INVALID_SIGNATURE
    );

    require(!deployCancelled[claim], DEPLOY_CANCELED);
    require(!deployPerformed[claim], DEPLOY_ALREADY_PERFORMED);

    deployPerformed[claim] = true;

    address xcert = _doActionsReplaceZeroAddress(_data);

    emit Perform(
      _data.maker,
      msg.sender,
      xcert,
      claim
    );
  }

  /**
   * @dev Cancels deploy.
   * @notice You can cancel the same deploy multiple times. There is no check for whether the deploy
   * was already canceled due to gas optimization. You should either check deployCancelled variable
   * or listen to Cancel event if you want to check if an deploy is already canceled.
   * @param _data Data of deploy to cancel.
   */
  function cancel(
    DeployData memory _data
  )
    public
  {
    require(_data.maker == msg.sender, MAKER_NOT_EQUAL_TO_SENDER);

    bytes32 claim = getDeployDataClaim(_data);
    require(!deployPerformed[claim], DEPLOY_ALREADY_PERFORMED);

    deployCancelled[claim] = true;
    emit Cancel(
      _data.maker,
      _data.taker,
      claim
    );
  }

  /**
   * @dev Calculates keccak-256 hash of DeployData from parameters.
   * @param _deployData Data needed for atomic swap.
   * @return keccak-hash of deploy data.
   */
  function getDeployDataClaim(
    DeployData memory _deployData
  )
    public
    view
    returns (bytes32)
  {
    bytes32 xcertData = keccak256(
      abi.encodePacked(
        _deployData.xcertData.name,
        _deployData.xcertData.symbol,
        _deployData.xcertData.uriBase,
        _deployData.xcertData.schemaId,
        _deployData.xcertData.capabilities,
        _deployData.xcertData.owner
      )
    );

    bytes32 transferData = keccak256(
      abi.encodePacked(
        _deployData.transferData.token,
        _deployData.transferData.to,
        _deployData.transferData.value
      )
    );

    return keccak256(
      abi.encodePacked(
        address(this),
        _deployData.maker,
        _deployData.taker,
        xcertData,
        transferData,
        _deployData.seed,
        _deployData.expiration
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
   * @dev Helper function that makes deploy actions.
   * @param _deploy Data needed for deploy.
   */
  function _doActions(
    DeployData memory _deploy
  )
    private
    returns (address _xcert)
  {
    Proxy(tokenTransferProxy).execute(
      _deploy.transferData.token,
      _deploy.maker,
      _deploy.transferData.to,
      _deploy.transferData.value
    );

    _xcert = address(
      new XcertCustom(
        _deploy.xcertData.name,
        _deploy.xcertData.symbol,
        _deploy.xcertData.uriBase,
        _deploy.xcertData.schemaId,
        _deploy.xcertData.capabilities,
        _deploy.xcertData.owner,
        assetCreateProxy
      )
    );
  }

  /**
   * @dev Helper function that makes deploy actions  and replaces zero addresses with msg.sender.
   * @param _deploy Data needed for deploy.
   */
  function _doActionsReplaceZeroAddress(
    DeployData memory _deploy
  )
    private
    returns (address _xcert)
  {
    if (_deploy.transferData.to == address(0))
    {
      _deploy.transferData.to = msg.sender;
    }

    Proxy(tokenTransferProxy).execute(
      _deploy.transferData.token,
      _deploy.maker,
      _deploy.transferData.to,
      _deploy.transferData.value
    );

    _xcert = address(
      new XcertCustom(
        _deploy.xcertData.name,
        _deploy.xcertData.symbol,
        _deploy.xcertData.uriBase,
        _deploy.xcertData.schemaId,
        _deploy.xcertData.capabilities,
        _deploy.xcertData.owner,
        assetCreateProxy
      )
    );
  }
}
