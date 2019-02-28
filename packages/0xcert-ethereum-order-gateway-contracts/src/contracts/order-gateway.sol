pragma solidity 0.5.3;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-proxy-contracts/src/contracts/iproxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-create-proxy.sol";

/**
 * @dev Decentralize exchange, creating, updating and other actions for fundgible and non-fundgible 
 * tokens powered by atomic swaps. 
 */
contract OrderGateway is
  Abilitable
{

  /**
   * @dev List of abilities:
   * 2 - Ability to set proxies.
   */
  uint8 constant ABILITY_TO_SET_PROXIES = 2;

  /**
   * @dev Xcert abilities.
   */
  uint8 constant ABILITY_ALLOW_CREATE_ASSET = 32;

  /**
   * @dev Error constants.
   */
  string constant INVALID_SIGNATURE_KIND = "015001";
  string constant INVALID_PROXY = "015002";
  string constant TAKER_NOT_EQUAL_TO_SENDER = "015003";
  string constant SENDER_NOT_TAKER_OR_MAKER = "015004";
  string constant CLAIM_EXPIRED = "015005";
  string constant INVALID_SIGNATURE = "015006";
  string constant ORDER_CANCELED = "015007";
  string constant ORDER_ALREADY_PERFORMED = "015008";
  string constant MAKER_NOT_EQUAL_TO_SENDER = "015009";
  string constant SIGNER_NOT_AUTHORIZED = "015010";

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
   * https://github.com/trezor/trezor-mcu/blob/master/firmware/crypto.c#L36 
   * @param eip721 Signature using eip721.
   */
  enum SignatureKind
  {
    eth_sign,
    trezor,
    eip712
  }

  /**
   * Enum of available action kinds.
   */
  enum ActionKind
  {
    create,
    transfer
  }

  /**
   * @dev Structure representing what to send and where.
   * @param token Address of the token we are sending.
   * @param proxy Id representing approved proxy address.
   * @param param1 Address of the sender or imprint.
   * @param to Address of the receiver.
   * @param value Amount of ERC20 or ID of ERC721.
   */
  struct ActionData 
  {
    ActionKind kind;
    uint32 proxy;
    address token;
    bytes32 param1;
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
   * @param actions Data of all the actions that should accure it this order.
   * @param signature Data from the signed claim.
   * @param seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param expiration Timestamp of when the claim expires. 0 if indefinet. 
   */
  struct OrderData 
  {
    address maker;
    address taker;
    ActionData[] actions;
    uint256 seed;
    uint256 expiration;
  }

  /** 
   * @dev Valid proxy contract addresses.
   */
  mapping(uint32 => address) public idToProxy;

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
   * @dev This event emmits when proxy address is changed..
   */
  event ProxyChange(
    uint32 indexed _id,
    address _proxy
  );

  /**
   * @dev Sets a verified proxy address. 
   * @notice Can be done through a multisig wallet in the future.
   * @param _id Id of the proxy.
   * @param _proxy Proxy address.
   */
  function setProxy(
    uint32 _id,
    address _proxy
  )
    external
    hasAbilities(ABILITY_TO_SET_PROXIES)
  {
    idToProxy[_id] = _proxy;
    emit ProxyChange(_id, _proxy);
  }

  /**
   * @dev Performs the ERC721/ERC20 atomic swap.
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

    _doActions(_data);

    emit Perform(
      _data.maker,
      _data.taker,
      claim
    );
  }

  /** 
   * @dev Cancels order
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
    bytes32 temp = 0x0;

    for(uint256 i = 0; i < _orderData.actions.length; i++)
    {
      temp = keccak256(
        abi.encodePacked(
          temp,
          _orderData.actions[i].kind,
          _orderData.actions[i].proxy,
          _orderData.actions[i].token,
          _orderData.actions[i].param1,
          _orderData.actions[i].to,
          _orderData.actions[i].value
        )
      );
    }

    return keccak256(
      abi.encodePacked(
        address(this),
        _orderData.maker,
        _orderData.taker,
        temp,
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
   * @dev Helper function that makes transfes.
   * @param _order Data needed for order.
   */
  function _doActions(
    OrderData memory _order
  )
    private
  {
    for(uint256 i = 0; i < _order.actions.length; i++)
    {
      require(
        idToProxy[_order.actions[i].proxy] != address(0),
        INVALID_PROXY
      );

      if (_order.actions[i].kind == ActionKind.create)
      {
        require(
          Abilitable(_order.actions[i].token).isAble(_order.maker, ABILITY_ALLOW_CREATE_ASSET),
          SIGNER_NOT_AUTHORIZED
        );
        
        XcertCreateProxy(idToProxy[_order.actions[i].proxy]).create(
          _order.actions[i].token,
          _order.actions[i].to,
          _order.actions[i].value,
          _order.actions[i].param1
        );
      } 
      else if (_order.actions[i].kind == ActionKind.transfer)
      {
        address from = address(uint160(bytes20(_order.actions[i].param1)));
        require(
          from == _order.maker
          || from == _order.taker,
          SENDER_NOT_TAKER_OR_MAKER
        );
        
        Proxy(idToProxy[_order.actions[i].proxy]).execute(
          _order.actions[i].token,
          from,
          _order.actions[i].to,
          _order.actions[i].value
        );
      }
    }
  }
  
}
