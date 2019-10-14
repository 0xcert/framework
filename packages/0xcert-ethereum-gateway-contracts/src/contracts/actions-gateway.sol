pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-proxy-contracts/src/contracts/iproxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-create-proxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-update-proxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/abilitable-manage-proxy.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/utils/bytes-to-types.sol";

/**
 * @dev Decentralize exchange, creating, updating and other actions for fundgible and non-fundgible
 * tokens powered by atomic swaps.
 */
contract ActionsGateway is
  Abilitable,
  BytesToTypes
{

  /**
   * @dev List of abilities:
   * 16 - Ability to set proxies.
   */
  uint8 constant ABILITY_TO_SET_PROXIES = 16;

  /**
   * @dev Xcert abilities.
   */
  uint8 constant ABILITY_ALLOW_MANAGE_ABILITITES = 2;
  uint16 constant ABILITY_ALLOW_CREATE_ASSET = 512;
  uint16 constant ABILITY_ALLOW_UPDATE_ASSET = 1024;

  /**
   * @dev Error constants.
   */
  string constant INVALID_SIGNATURE_KIND = "015001";
  string constant INVALID_PROXY = "015002";
  string constant SIGNATURES_LENGTH_INVALID = "015003";
  string constant SENDER_NOT_A_SIGNER = "015004";
  string constant CLAIM_EXPIRED = "015005";
  string constant INVALID_SIGNATURE = "015006";
  string constant ORDER_CANCELED = "015007";
  string constant ORDER_ALREADY_PERFORMED = "015008";
  string constant SIGNERS_DOES_NOT_INCLUDE_SENDER = "015009";
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
   * Enum of available action kinds.
   */
  enum ActionKind
  {
    create,
    transfer,
    update,
    manage_abilities
  }

  /**
   * @dev Structure defining address information.
   * @param proxyAddress Smart contract address of the proxy.
   * @param kind Kind of actions that can be performed on this proxy.
   */
  struct ProxyData
  {
    address proxyAddress;
    ActionKind kind;
  }

  /**
   * @dev Structure representing what to send and where.
   * @notice For update action kind to parameter is unnecessary. For this reason we recommend you
   * set it to zero address (0x000...0) since it costs less.
   * @param proxyId Id representing approved proxy address.
   * @param contractAddress Address of the contract we are operating upon.
   * @param params Opaque parameter encoding which is interpreted differently for each ActionKind.
   */
  struct ActionData
  {
    uint32 proxyId;
    address contractAddress;
    bytes params;
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
   * @param signers Addresses of everyone that need to sign this order for it to be valid, with the
   * last address possibly being the zero address which indicates a dynamic order in which zero
   * addresses get replaced by the signer of the last signature if there are the same amount of
   * signatures and signers or with msg.sender in case the amount of signatures is one less then
   * signers specified. Must have at least one signer.
   * @param actions Data of all the actions that should occur in this order.
   * @param seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param expiration Timestamp of when the claim expires. 0 if indefinet.
   */
  struct OrderData
  {
    address[] signers;
    ActionData[] actions;
    uint256 seed;
    uint256 expiration;
  }

  /**
   * @dev Valid proxy contracts, or zero, for removed proxies.
   */
  ProxyData[] public proxies;

  /**
   * @dev Mapping of all cancelled orders.
   */
  mapping(bytes32 => bool) public orderCancelled;

  /**
   * @dev Mapping of all performed orders.
   */
  mapping(bytes32 => bool) public orderPerformed;

  /**
   * @dev This event emits when tokens change ownership.
   */
  event Perform(
    bytes32 indexed _claim
  );

  /**
   * @dev This event emits when transfer order is cancelled.
   */
  event Cancel(
    bytes32 indexed _claim
  );

  /**
   * @dev This event emits when proxy address is changed..
   */
  event ProxyChange(
    uint256 indexed _index,
    address _proxy
  );

  /**
   * @dev Adds a verified proxy address.
   * @notice Can be done through a multisig wallet in the future.
   * @param _proxy Proxy address.
   */
  function addProxy(
    address _proxy,
    ActionKind _kind
  )
    external
    hasAbilities(ABILITY_TO_SET_PROXIES)
  {
    uint256 length = proxies.push(ProxyData(_proxy, _kind));
    emit ProxyChange(length - 1, _proxy);
  }

  /**
   * @dev Removes a proxy address.
   * @notice Can be done through a multisig wallet in the future.
   * @param _index Index of proxy we are removing.
   */
  function removeProxy(
    uint256 _index
  )
    external
    hasAbilities(ABILITY_TO_SET_PROXIES)
  {
    proxies[_index].proxyAddress = address(0);
    emit ProxyChange(_index, address(0));
  }

  /**
   * @dev Performs the atomic swap that can exchange, create, update and do other actions for
   * fungible and non-fungible tokens.
   * @param _data Data required to make the order.
   * @param _signatures Data from the signature.
   */
  function perform(
    OrderData memory _data,
    SignatureData[] memory _signatures
  )
    public
  {
    require(_data.expiration >= now, CLAIM_EXPIRED);
    bytes32 claim = getOrderDataClaim(_data);
    // Signers lenght represents the amount of signatures we have to check. Either we check all or
    // skip the last one as it represents the msg.sender. For optimization reason the same variable
    // is also used as a representive of the index of the last signer and for checking the amount of
    // signatures.
    uint256 signersLength = _data.signers.length - 1;
    // Address with which we are replacing zero address in case of any taker/signer.
    address replaceAddress = address(0);
    // If the last signer is zero address then we treat this as an any taker/signer order.
    // This means we replace zero address with the last signer or the order executor.
    if (_data.signers[signersLength] == address(0))
    {
      // If the last signature is missing then the address we are replacing with is the msg.sender
      // else the address associated with the last signature is used.
      if (signersLength == _signatures.length) {
        replaceAddress = msg.sender;
      } else {
        replaceAddress = recoverSigner(claim, _signatures[signersLength]);
      }
      _data.signers[signersLength] = replaceAddress;
      // If it is not an any taker/signature order and the last signature is missing then the
      // executor (msg.sender) has to be the last signer.
    } else if (signersLength == _signatures.length) {
      require(_data.signers[signersLength] == msg.sender, SENDER_NOT_A_SIGNER);
      // If non of the above is true then we need to check all the signatures.
    } else { // (_data.signers[signersLength] != address(0) && (signersLength != _signatures.length)
      signersLength += 1;
    }

    for (uint8 i = 0; i < signersLength; i++)
    {
      require(
        isValidSignature(
          _data.signers[i],
          claim,
          _signatures[i]
        ),
        INVALID_SIGNATURE
      );
    }

    require(!orderCancelled[claim], ORDER_CANCELED);
    require(!orderPerformed[claim], ORDER_ALREADY_PERFORMED);

    orderPerformed[claim] = true;
    _doActionsReplaceZeroAddress(_data, replaceAddress);

    emit Perform(claim);
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
    bool present = false;
    for (uint8 i = 0; i < _data.signers.length; i++) {
      if (_data.signers[i] == msg.sender) {
        present = true;
        break;
      }
    }
    require(present, SIGNERS_DOES_NOT_INCLUDE_SENDER);

    bytes32 claim = getOrderDataClaim(_data);
    require(!orderPerformed[claim], ORDER_ALREADY_PERFORMED);

    orderCancelled[claim] = true;
    emit Cancel(claim);
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
          _orderData.actions[i].proxyId,
          _orderData.actions[i].contractAddress,
          _orderData.actions[i].params
        )
      );
    }

    return keccak256(
      abi.encodePacked(
        address(this),
        _orderData.signers,
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
    return _signer == recoverSigner(_claim, _signature);
  }

  /**
   * @dev Gets address of the signer.
   * @param _claim Signed Keccak-256 hash.
   * @param _signature Signature data.
   */
  function recoverSigner(
    bytes32 _claim,
    SignatureData memory _signature
  )
    public
    pure
    returns (address)
  {
    if (_signature.kind == SignatureKind.eth_sign)
    {
      return ecrecover(
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
      return ecrecover(
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
      return ecrecover(
        _claim,
        _signature.v,
        _signature.r,
        _signature.s
      );
    }

    revert(INVALID_SIGNATURE_KIND);
  }

  /**
   * @dev Helper function that makes order actions and replaces zero addresses with msg.sender.
   * @param _order Data needed for order.
   */
  function _doActionsReplaceZeroAddress(
    OrderData memory _order,
    address _replaceAddress
  )
    private
  {
    for(uint256 i = 0; i < _order.actions.length; i++)
    {
      require(
        proxies[_order.actions[i].proxyId].proxyAddress != address(0),
        INVALID_PROXY
      );

      if (proxies[_order.actions[i].proxyId].kind == ActionKind.create)
      {
        require(
          Abilitable(_order.actions[i].contractAddress).isAble(
            _order.signers[bytesToUint8(85, _order.actions[i].params)],
            ABILITY_ALLOW_CREATE_ASSET
          ),
          SIGNER_NOT_AUTHORIZED
        );

        address to = bytesToAddress(84, _order.actions[i].params);
        if (to == address(0)) {
          to = _replaceAddress;
        }

        XcertCreateProxy(proxies[_order.actions[i].proxyId].proxyAddress).create(
          _order.actions[i].contractAddress,
          to,
          bytesToUint256(64, _order.actions[i].params),
          bytesToBytes32(32, _order.actions[i].params)
        );
      }
      else if (proxies[_order.actions[i].proxyId].kind == ActionKind.transfer)
      {
        address from = _order.signers[bytesToUint8(53, _order.actions[i].params)];
        address to = bytesToAddress(52, _order.actions[i].params);
        if (to == address(0)) {
          to = _replaceAddress;
        }
        Proxy(proxies[_order.actions[i].proxyId].proxyAddress).execute(
          _order.actions[i].contractAddress,
          from,
          to,
          bytesToUint256(32, _order.actions[i].params)
        );
      }
      else if (proxies[_order.actions[i].proxyId].kind == ActionKind.update)
      {
        require(
          Abilitable(_order.actions[i].contractAddress).isAble(
            _order.signers[bytesToUint8(65, _order.actions[i].params)],
            ABILITY_ALLOW_UPDATE_ASSET
          ),
          SIGNER_NOT_AUTHORIZED
        );

        XcertUpdateProxy(proxies[_order.actions[i].proxyId].proxyAddress).update(
          _order.actions[i].contractAddress,
          bytesToUint256(64, _order.actions[i].params),
          bytesToBytes32(32, _order.actions[i].params)
        );
      }
      else if (proxies[_order.actions[i].proxyId].kind == ActionKind.manage_abilities)
      {
        require(
          Abilitable(_order.actions[i].contractAddress).isAble(
            _order.signers[bytesToUint8(53, _order.actions[i].params)],
            ABILITY_ALLOW_MANAGE_ABILITITES
          ),
          SIGNER_NOT_AUTHORIZED
        );

        address to = bytesToAddress(52, _order.actions[i].params);
        if (to == address(0)) {
          to = _replaceAddress;
        }

        AbilitableManageProxy(proxies[_order.actions[i].proxyId].proxyAddress).set(
          _order.actions[i].contractAddress,
          to,
          bytesToUint256(32, _order.actions[i].params)
        );
      }
    }
  }

}
