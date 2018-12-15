pragma solidity ^0.5.1;

import "@0xcert/ethereum-utils-contracts/src/contracts/math/safe-math.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/utils/address-utils.sol";
import "@0xcert/ethereum-erc721-contracts/src/contracts/nf-token-metadata-enumerable.sol";

/**
 * @dev Xcert implementation.
 */
contract Xcert is 
  NFTokenMetadataEnumerable,
  Abilitable
{
  using SafeMath for uint256;
  using AddressUtils for address;

  /**
   * @dev List of abilities (gathered from all extensions):
   */
  uint8 constant ABILITY_CREATE_ASSET = 1;
  uint8 constant ABILITY_REVOKE_ASSET = 2;
  uint8 constant ABILITY_TOGGLE_TRANSFERS = 3;
  uint8 constant ABILITY_UPDATE_ASSET_IMPRINT = 4;
  uint8 constant ABILITY_UPDATE_URI_BASE = 6;

  /**
   * @dev Error constants.
   */
  string constant CAPABILITY_NOT_SUPPORTED = "007001";
  string constant TRANSFERS_DISABLED = "007002";
  string constant NOT_VALID_XCERT = "007003";
  string constant NOT_OWNER_OR_OPERATOR = "007004";

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
   * @dev Are Xcerts paused or not.
   */
  bool public isPaused;

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftSchemaId, nftName, nftSymbol
   * and uriBase.
   */
  constructor()
    public
  {
    supportedInterfaces[0xca12f2bf] = true; // Xcert
  }

  /**
   * @dev Mints a new Xcert.
   * @param _to The address that will own the minted Xcert.
   * @param _id The Xcert to be minted by the msg.sender.
   * @param _imprint Cryptographic asset imprint.
   */
  function mint(
    address _to,
    uint256 _id,
    bytes32 _imprint
  )
    external
    hasAbility(ABILITY_CREATE_ASSET)
  {
    super._mint(_to, _id);
    idToImprint[_id] = _imprint;
  }

  /**
   * @dev Returns a bytes4 of keccak256 of json schema representing 0xcert protocol convention.
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
   */
  function tokenImprint(
    uint256 _tokenId
  )
    external
    view
    returns(bytes32)
  {
    return idToImprint[_tokenId];
  }

  /**
   * @dev Change URI base.
   * @param _uriBase New uriBase.
   */
  function setUriBase(
    string calldata _uriBase
  )
    external
    hasAbility(ABILITY_UPDATE_URI_BASE)
  {
    super._setUriBase(_uriBase);
  }

  /**
   * @dev Revokes a specified Xcert. Reverts if not called from contract owner or authorized 
   * address.
   * @param _tokenId Id of the Xcert we want to burn.
   */
  function revoke(
    uint256 _tokenId
  )
    external
    hasAbility(ABILITY_REVOKE_ASSET)
  {
    require(supportedInterfaces[0x20c5429b], CAPABILITY_NOT_SUPPORTED);
    super._burn(_tokenId);
    delete idToImprint[_tokenId];
  }

  /**
   * @dev Sets if Xcerts are paused or not.
   * @param _isPaused Pause status.
   */
  function setPause(
    bool _isPaused
  )
    external
    hasAbility(ABILITY_TOGGLE_TRANSFERS)
  {
    require(supportedInterfaces[0xbedb86fb], CAPABILITY_NOT_SUPPORTED);
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
    hasAbility(ABILITY_UPDATE_ASSET_IMPRINT)
  {
    require(supportedInterfaces[0xbda0e852], CAPABILITY_NOT_SUPPORTED);
    require(idToOwner[_tokenId] != address(0), NOT_VALID_XCERT);
    idToImprint[_tokenId] = _imprint;
    emit TokenImprintUpdate(_tokenId, _imprint);
  }

  /**
   * @dev Burns a specified Xcert. Reverts if not called from xcert owner or operator.
   * @param _tokenId Id of the Xcert we want to burn.
   */
  function burn(
    uint256 _tokenId
  )
    external
  {
    require(supportedInterfaces[0x42966c68], CAPABILITY_NOT_SUPPORTED);
    address tokenOwner = idToOwner[_tokenId];
    super._burn(_tokenId);
    require(
      tokenOwner == msg.sender || ownerToOperators[tokenOwner][msg.sender],
      NOT_OWNER_OR_OPERATOR
    );
    delete idToImprint[_tokenId];
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
    if(supportedInterfaces[0xbedb86fb])
      require(!isPaused, TRANSFERS_DISABLED);
    super._transferFrom(_from, _to, _tokenId);
  }
}
