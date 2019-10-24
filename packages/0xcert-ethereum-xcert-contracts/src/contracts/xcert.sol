pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "./ixcert.sol";
import "./ixcert-burnable.sol";
import "./ixcert-mutable.sol";
import "./ixcert-pausable.sol";
import "./ixcert-revokable.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";
import "@0xcert/ethereum-erc721-contracts/src/contracts/nf-token-metadata-enumerable.sol";
import "@0xcert/ethereum-erc20-contracts/src/contracts/erc20.sol";

/**
 * @dev Xcert implementation.
 */
contract XcertToken is
  Xcert,
  XcertBurnable,
  XcertMutable,
  XcertPausable,
  XcertRevokable,
  NFTokenMetadataEnumerable,
  Abilitable
{

  /**
   * @dev List of abilities (gathered from all extensions):
   */
  uint8 constant ABILITY_CREATE_ASSET = 16;
  uint8 constant ABILITY_REVOKE_ASSET = 32;
  uint8 constant ABILITY_TOGGLE_TRANSFERS = 64;
  uint8 constant ABILITY_UPDATE_ASSET_IMPRINT = 128;
  uint16 constant ABILITY_UPDATE_URI = 256;
  /// ABILITY_ALLOW_CREATE_ASSET = 512 - A specific ability that is bounded to atomic orders.
  /// When creating a new Xcert trough `ActionsGateway`, the order maker has to have this ability.
  /// ABILITY_ALLOW_UPDATE_ASSET = 1024 - A specific ability that is bounded to atomic orders.
  /// When updating imprint of an Xcert trough `ActionsGateway`, the order maker has to have this
  /// ability.

  /**
   * @dev List of capabilities (supportInterface bytes4 representations).
   */
  bytes4 constant MUTABLE = 0xbda0e852;
  bytes4 constant BURNABLE = 0x9d118770;
  bytes4 constant PAUSABLE = 0xbedb86fb;
  bytes4 constant REVOKABLE = 0x20c5429b;

  /**
   * @dev Error constants.
   */
  string constant CAPABILITY_NOT_SUPPORTED = "007001";
  string constant TRANSFERS_DISABLED = "007002";
  string constant NOT_VALID_XCERT = "007003";
  string constant NOT_OWNER_OR_OPERATOR = "007004";
  string constant INVALID_SIGNATURE = "007005";
  string constant INVALID_SIGNATURE_KIND = "007006";
  string constant CLAIM_PERFORMED = "007007";
  string constant CLAIM_EXPIRED = "007008";

  /**
   * @dev This emits when ability of beeing able to transfer Xcerts changes (paused/unpaused).
   */
  event IsPaused(bool isPaused);

  /**
   * @dev Emits when imprint of a token is changed.
   * @param _tokenId Id of the Xcert.
   * @param _imprint Cryptographic asset imprint.
   */
  event TokenImprintUpdate(
    uint256 indexed _tokenId,
    bytes32 _imprint
  );

  /**
   * @dev Mapping of all performed claims.
   */
  mapping(bytes32 => bool) public claimPerformed;

  /**
   * @dev Unique ID which determines each Xcert smart contract type by its JSON convention.
   * @notice Calculated as keccak256(jsonSchema).
   */
  bytes32 internal nftSchemaId;

  /**
   * @dev Maps NFT ID to imprint.
   */
  mapping (uint256 => bytes32) internal idToImprint;

  /**
   * @dev Maps address to authorization of contract.
   */
  mapping (address => bool) internal addressToAuthorized;

  /**
   * @dev Are Xcerts transfers paused (can be performed) or not.
   */
  bool public isPaused;

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftSchemaId, nftName, nftSymbol
   * and uriPrefix.
   */
  constructor()
    public
  {
    supportedInterfaces[0x4ecc17d1] = true; // Xcert
  }

  /**
   * @dev Creates a new Xcert.
   * @param _to The address that will own the created Xcert.
   * @param _id The Xcert to be created by the msg.sender.
   * @param _imprint Cryptographic asset imprint.
   */
  function create(
    address _to,
    uint256 _id,
    bytes32 _imprint
  )
    external
    hasAbilities(ABILITY_CREATE_ASSET)
  {
    super._create(_to, _id);
    idToImprint[_id] = _imprint;
  }

  /**
   * @dev Change URI.
   * @param _uriPrefix New URI prefix.
   * @param _uriPostfix New URI postfix.
   */
  function setUri(
    string calldata _uriPrefix,
    string calldata _uriPostfix
  )
    external
    hasAbilities(ABILITY_UPDATE_URI)
  {
    super._setUri(_uriPrefix, _uriPostfix);
  }

  /**
   * @dev Revokes(destroys) a specified Xcert. Reverts if not called from contract owner or
   * authorized address.
   * @param _tokenId Id of the Xcert we want to destroy.
   */
  function revoke(
    uint256 _tokenId
  )
    external
    hasAbilities(ABILITY_REVOKE_ASSET)
  {
    require(supportedInterfaces[REVOKABLE], CAPABILITY_NOT_SUPPORTED);
    super._destroy(_tokenId);
    delete idToImprint[_tokenId];
  }

  /**
   * @dev Sets if Xcerts transfers are paused (can be performed) or not.
   * @param _isPaused Pause status.
   */
  function setPause(
    bool _isPaused
  )
    external
    hasAbilities(ABILITY_TOGGLE_TRANSFERS)
  {
    require(supportedInterfaces[PAUSABLE], CAPABILITY_NOT_SUPPORTED);
    isPaused = _isPaused;
    emit IsPaused(_isPaused);
  }

  /**
   * @dev Updates Xcert imprint.
   * @param _tokenId Id of the Xcert.
   * @param _imprint New imprint.
   */
  function updateTokenImprint(
    uint256 _tokenId,
    bytes32 _imprint
  )
    external
    hasAbilities(ABILITY_UPDATE_ASSET_IMPRINT)
  {
    require(supportedInterfaces[MUTABLE], CAPABILITY_NOT_SUPPORTED);
    require(idToOwner[_tokenId] != address(0), NOT_VALID_XCERT);
    idToImprint[_tokenId] = _imprint;
    emit TokenImprintUpdate(_tokenId, _imprint);
  }

  /**
   * @dev Destroys a specified Xcert. Reverts if not called from Xcert owner or operator.
   * @param _tokenId Id of the Xcert we want to destroy.
   */
  function destroy(
    uint256 _tokenId
  )
    external
  {
    require(supportedInterfaces[BURNABLE], CAPABILITY_NOT_SUPPORTED);
    address tokenOwner = idToOwner[_tokenId];
    super._destroy(_tokenId);
    require(
      tokenOwner == msg.sender || ownerToOperators[tokenOwner][msg.sender],
      NOT_OWNER_OR_OPERATOR
    );
    delete idToImprint[_tokenId];
  }

  /**
   * @dev Destroys a specified Xcert. Reverts if not called from Xcert owner or operator.
   * @param _destroyer Address that is destroying the token.
   * @param _tokenId Id of the Xcert we want to destroy.
   * @param _feeToken The token then will be tranfered to the executor of this method.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
   * @param _signature Data from the signature.
   */
  function destroyWithSignature(
    address _destroyer,
    uint256 _tokenId,
    address _feeToken,
    uint256 _feeValue,
    uint256 _seed,
    uint256 _expiration,
    SignatureData calldata _signature
  )
    external
  {
    require(supportedInterfaces[BURNABLE], CAPABILITY_NOT_SUPPORTED);
    bytes32 claim = generateDestroyClaim(
      _destroyer,
      _tokenId,
      _feeToken,
      _feeValue,
      _seed,
      _expiration
    );
    require(
      isValidSignature(
        _destroyer,
        claim,
        _signature
      ),
      INVALID_SIGNATURE
    );
    require(!claimPerformed[claim], CLAIM_PERFORMED);
    require(_expiration >= now, CLAIM_EXPIRED);
    claimPerformed[claim] = true;
    address tokenOwner = idToOwner[_tokenId];
    super._destroy(_tokenId);
    require(
      tokenOwner == _destroyer || ownerToOperators[tokenOwner][_destroyer],
      NOT_OWNER_OR_OPERATOR
    );
    // ERC20(_feeToken).transferFrom(_destroyer, msg.sender, _feeValue);
    delete idToImprint[_tokenId];
  }

  /**
   * @dev Enables or disables approval for a third party ("operator") to manage all of
   * `msg.sender`'s assets. It also emits the ApprovalForAll event.
   * @notice This works even if sender doesn't own any tokens at the time.
   * @param _owner Address to the owner who is approving.
   * @param _operator Address to add to the set of authorized operators.
   * @param _approved True if the operators is approved, false to revoke approval.
   * @param _feeToken The token then will be tranfered to the executor of this method.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
   * @param _signature Data from the signature.
   */
  function setApprovalForAllWithSignature(
    address _owner,
    address _operator,
    bool _approved,
    address _feeToken,
    uint256 _feeValue,
    uint256 _seed,
    uint256 _expiration,
    SignatureData calldata _signature
  )
    external
  {
    bytes32 claim = generateApprovalClaim(
      _owner,
      _operator,
      _approved,
      _feeToken,
      _feeValue,
      _seed,
      _expiration
    );
    require(
      isValidSignature(
        _owner,
        claim,
        _signature
      ),
      INVALID_SIGNATURE
    );
    require(!claimPerformed[claim], CLAIM_PERFORMED);
    require(_expiration >= now, CLAIM_EXPIRED);
    claimPerformed[claim] = true;
    ownerToOperators[_owner][_operator] = _approved;
    ERC20(_feeToken).transferFrom(_owner, msg.sender, _feeValue);
    emit ApprovalForAll(_owner, _operator, _approved);
  }

  /**
   * @dev Generates hash of the set approval for.
   * @param _owner Address to the owner who is approving.
   * @param _operator Address to add to the set of authorized operators.
   * @param _approved True if the operators is approved, false to revoke approval.
   * @param _feeToken The token then will be tranfered to the executor of this method.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
  */
  function generateApprovalClaim(
    address _owner,
    address _operator,
    bool _approved,
    address _feeToken,
    uint256 _feeValue,
    uint256 _seed,
    uint256 _expiration
  )
    public
    view
    returns(bytes32)
  {
    return keccak256(
      abi.encodePacked(
        address(this),
        _owner,
        _operator,
        _approved,
        _feeToken,
        _feeValue,
        _seed,
        _expiration
      )
    );
  }

  /**
   * @dev Generates hash of the destroy.
   * @param _destroyer Address that is destroying the token.
   * @param _tokenId Id of the Xcert we want to destroy.
   * @param _feeToken The token then will be tranfered to the executor of this method.
   * @param _feeValue The amount of token then will be tranfered to the executor of this method.
   * @param _seed Arbitrary number to facilitate uniqueness of the order's hash. Usually timestamp.
   * @param _expiration Timestamp of when the claim expires.
  */
  function generateDestroyClaim(
    address _destroyer,
    uint256 _tokenId,
    address _feeToken,
    uint256 _feeValue,
    uint256 _seed,
    uint256 _expiration
  )
    public
    view
    returns(bytes32)
  {
    return keccak256(
      abi.encodePacked(
        address(this),
        _destroyer,
        _tokenId,
        _feeToken,
        _feeValue,
        _seed,
        _expiration
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
    } else if (_signature.kind == SignatureKind.no_prefix)
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
   * @dev Returns a bytes32 of sha256 of json schema representing 0xcert Protocol convention.
   * @return Schema id.
   */
  function schemaId()
    external
    view
    returns (bytes32 _schemaId)
  {
    _schemaId = nftSchemaId;
  }

  /**
   * @dev Returns imprint for Xcert.
   * @param _tokenId Id of the Xcert.
   * @return Token imprint.
   */
  function tokenImprint(
    uint256 _tokenId
  )
    external
    view
    returns(bytes32 imprint)
  {
    imprint = idToImprint[_tokenId];
  }

  /**
   * @dev Helper methods that actually does the transfer.
   * @param _from The current owner of the NFT.
   * @param _to The new owner.
   * @param _tokenId The NFT to transfer.
   */
  function _transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  )
    internal
  {
    /**
     * if (supportedInterfaces[0xbedb86fb])
     * {
     *   require(!isPaused, TRANSFERS_DISABLED);
     * }
     * There is no need to check for pausable capability here since by using logical deduction we
     * can say based on code above that:
     * !supportedInterfaces[0xbedb86fb] => !isPaused
     * isPaused => supportedInterfaces[0xbedb86fb]
     * (supportedInterfaces[0xbedb86fb] ∧ isPaused) <=> isPaused.
     * This saves 200 gas.
     */
    require(!isPaused, TRANSFERS_DISABLED);
    super._transferFrom(_from, _to, _tokenId);
  }
}
