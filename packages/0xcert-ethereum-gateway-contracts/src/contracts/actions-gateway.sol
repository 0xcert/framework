pragma solidity 0.6.1;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-proxy-contracts/src/contracts/iproxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-create-proxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-burn-proxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/xcert-update-proxy.sol";
import "@0xcert/ethereum-proxy-contracts/src/contracts/abilitable-manage-proxy.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/utils/bytes-type.sol";
import "@0xcert/ethereum-erc721-contracts/src/contracts/erc721.sol";

/**
 * @dev Decentralize exchange, creating, updating and other actions for fungible and non-fungible
 * tokens powered by atomic swaps.
 */
contract ActionsGateway is
  Abilitable
{

  /**
   * @dev List of this contract abilities:
   * 16 - Ability to set proxies.
   */
  uint8 constant ABILITY_TO_SET_PROXIES = 16;

  /**
   * @dev Xcert abilities.
   */
  uint8 constant ABILITY_ALLOW_MANAGE_ABILITIES = 2;
  uint16 constant ABILITY_ALLOW_CREATE_ASSET = 512;
  uint16 constant ABILITY_ALLOW_UPDATE_ASSET = 1024;

  /**
   * @dev Error constants.
   */
  string constant INVALID_SIGNATURE_KIND = "015001";
  string constant INVALID_PROXY = "015002";
  string constant SENDER_NOT_A_SIGNER = "015003";
  string constant CLAIM_EXPIRED = "015004";
  string constant INVALID_SIGNATURE = "015005";
  string constant ORDER_CANCELED = "015006";
  string constant ORDER_ALREADY_PERFORMED = "015007";
  string constant SIGNERS_DOES_NOT_INCLUDE_SENDER = "015008";
  string constant SIGNER_DOES_NOT_HAVE_ALLOW_CREATE_ASSET_ABILITY = "015009";
  string constant SIGNER_DOES_NOT_HAVE_ALLOW_UPDATE_ASSET_ABILITY = "015010";
  string constant SIGNER_DOES_NOT_HAVE_ALLOW_MANAGE_ABILITIES_ABILITY = "015011";
  string constant SIGNER_IS_NOT_DESTROY_ASSET_OWNER = "015012";

  /**
   * @dev Constants for decoding bytes depending on ActionKind.
   */
  uint8 constant ACTION_CREATE_BYTES_FROM_INDEX = 85;
  uint8 constant ACTION_CREATE_BYTES_RECEIVER = 84;
  uint8 constant ACTION_CREATE_BYTES_ID = 64;
  uint8 constant ACTION_CREATE_BYTES_IMPRINT = 32;
  uint8 constant ACTION_TRANSFER_BYTES_FROM_INDEX = 53;
  uint8 constant ACTION_TRANSFER_BYTES_RECEIVER = 52;
  uint8 constant ACTION_TRANSFER_BYTES_ID = 32;
  uint8 constant ACTION_UPDATE_BYTES_FROM_INDEX = 65;
  uint8 constant ACTION_UPDATE_BYTES_ID = 64;
  uint8 constant ACTION_UPDATE_BYTES_IMPRINT = 32;
  uint8 constant ACTION_MANAGE_ABILITIES_BYTES_FROM_INDEX = 53;
  uint8 constant ACTION_MANAGE_ABILITIES_BYTES_RECEIVER = 52;
  uint8 constant ACTION_MANAGE_ABILITIES_BYTES_ABILITIES = 32;
  uint8 constant ACTION_BURN_BYTES_FROM_INDEX = 33;
  uint8 constant ACTION_BURN_BYTES_ID = 32;

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
    no_prefix
  }

  /**
   * Enum of available action kinds.
   */
  enum ActionKind
  {
    create,
    transfer,
    update,
    manage_abilities,
    burn
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
   * @notice For update action kind to parameter is unnecessary. For this reason, we recommend you
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
   * signatures and signers or with msg.sender in case the amount of signatures is one less than
   * signers specified. Must have at least one signer.
   * @param actions Data of all the actions that should occur in this order.
   * @param seed Arbitrary number to facilitate the uniqueness of the order's hash. Usually, timestamp.
   * @param expiration Timestamp of when the claim expires. 0 if undefined.
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
    proxies.push(ProxyData(_proxy, _kind));
    emit ProxyChange(proxies.length - 1, _proxy);
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
    require(_data.expiration > now, CLAIM_EXPIRED);
    bytes32 claim = getOrderDataClaim(_data);
    // Signers lenght represents the amount of signatures we have to check. Either we check all or
    // skip the last one as it represents the msg.sender. For optimization reason the same variable
    // is also used as a representive of the index of the last signer and for checking the amount of
    // signatures.
    uint256 signersLength = _data.signers.length - 1;
    // Address with which we are replacing zero address in case of any taker/signer.
    address anyAddress;
    // If the last signer is zero address then we treat this as an any taker/signer order.
    // This means we replace zero address with the last signer or the order executor.
    if (_data.signers[signersLength] == address(0))
    {
      // If the last signature is missing then the address we are replacing with is the msg.sender
      // else the address associated with the last signature is used.
      if (signersLength == _signatures.length) {
        anyAddress = msg.sender;
      } else {
        anyAddress = recoverSigner(claim, _signatures[signersLength]);
      }
      _data.signers[signersLength] = anyAddress;
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
    _doActionsReplaceZeroAddress(_data, anyAddress);

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
    bytes32 actionsHash = 0x0;

    for(uint256 i = 0; i < _orderData.actions.length; i++)
    {
      actionsHash = keccak256(
        abi.encodePacked(
          actionsHash,
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
        actionsHash,
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
    } else if (_signature.kind == SignatureKind.no_prefix)
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
    address _anyAddress
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
            _order.signers[
              BytesType.toUint8(ACTION_CREATE_BYTES_FROM_INDEX, _order.actions[i].params)
            ],
            ABILITY_ALLOW_CREATE_ASSET
          ),
          SIGNER_DOES_NOT_HAVE_ALLOW_CREATE_ASSET_ABILITY
        );

        address to = BytesType.toAddress(ACTION_CREATE_BYTES_RECEIVER, _order.actions[i].params);
        if (to == address(0)) {
          to = _anyAddress;
        }

        XcertCreateProxy(proxies[_order.actions[i].proxyId].proxyAddress).create(
          _order.actions[i].contractAddress,
          to,
          BytesType.toUint256(ACTION_CREATE_BYTES_ID, _order.actions[i].params),
          BytesType.toBytes32(ACTION_CREATE_BYTES_IMPRINT, _order.actions[i].params)
        );
      }
      else if (proxies[_order.actions[i].proxyId].kind == ActionKind.transfer)
      {
        address from = _order.signers[
          BytesType.toUint8(ACTION_TRANSFER_BYTES_FROM_INDEX, _order.actions[i].params)
        ];
        address to = BytesType.toAddress(ACTION_TRANSFER_BYTES_RECEIVER, _order.actions[i].params);
        if (to == address(0)) {
          to = _anyAddress;
        }

        Proxy(proxies[_order.actions[i].proxyId].proxyAddress).execute(
          _order.actions[i].contractAddress,
          from,
          to,
          BytesType.toUint256(ACTION_TRANSFER_BYTES_ID, _order.actions[i].params)
        );
      }
      else if (proxies[_order.actions[i].proxyId].kind == ActionKind.update)
      {
        require(
          Abilitable(_order.actions[i].contractAddress).isAble(
            _order.signers[
              BytesType.toUint8(ACTION_UPDATE_BYTES_FROM_INDEX, _order.actions[i].params)
            ],
            ABILITY_ALLOW_UPDATE_ASSET
          ),
          SIGNER_DOES_NOT_HAVE_ALLOW_UPDATE_ASSET_ABILITY
        );

        XcertUpdateProxy(proxies[_order.actions[i].proxyId].proxyAddress).update(
          _order.actions[i].contractAddress,
          BytesType.toUint256(ACTION_UPDATE_BYTES_ID, _order.actions[i].params),
          BytesType.toBytes32(ACTION_UPDATE_BYTES_IMPRINT, _order.actions[i].params)
        );
      }
      else if (proxies[_order.actions[i].proxyId].kind == ActionKind.manage_abilities)
      {
        require(
          Abilitable(_order.actions[i].contractAddress).isAble(
            _order.signers[
              BytesType.toUint8(ACTION_MANAGE_ABILITIES_BYTES_FROM_INDEX, _order.actions[i].params)
            ],
            ABILITY_ALLOW_MANAGE_ABILITIES
          ),
          SIGNER_DOES_NOT_HAVE_ALLOW_MANAGE_ABILITIES_ABILITY
        );

        address to = BytesType.toAddress(
          ACTION_MANAGE_ABILITIES_BYTES_RECEIVER,
          _order.actions[i].params
        );

        if (to == address(0)) {
          to = _anyAddress;
        }

        AbilitableManageProxy(proxies[_order.actions[i].proxyId].proxyAddress).set(
          _order.actions[i].contractAddress,
          to,
          BytesType.toUint256(ACTION_MANAGE_ABILITIES_BYTES_ABILITIES, _order.actions[i].params)
        );
      } else if (proxies[_order.actions[i].proxyId].kind == ActionKind.burn)
      {
        uint256 id = BytesType.toUint256(ACTION_BURN_BYTES_ID, _order.actions[i].params);
        require(
          _order.signers[
            BytesType.toUint8(ACTION_BURN_BYTES_FROM_INDEX, _order.actions[i].params)
          ] == ERC721(_order.actions[i].contractAddress).ownerOf(id),
          SIGNER_IS_NOT_DESTROY_ASSET_OWNER
        );

        XcertBurnProxy(proxies[_order.actions[i].proxyId].proxyAddress).destroy(
          _order.actions[i].contractAddress,
          id
        );
      }
    }
  }

}
