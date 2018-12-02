pragma solidity ^0.4.25;

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
  /**
   * @dev List of abilities (gathered from all extensions):
   * 1 - Ability to mint new xcerts.
   * 2 - Ability to revoke xcerts.
   * 3 - Ability to pause xcert transfers.
   * 4 - Ability to change xcert proof.
   * 5 - Ability to sign claims (valid signatures for minter).
   * 6 - Ability to change URI base.
   */
  uint8 constant ABILITY_TO_MINT_NEW_XCERTS = 1;
  uint8 constant ABILITY_TO_CHANGE_URI_BASE = 6;

  using SafeMath for uint256;
  using AddressUtils for address;

  /**
   * @dev Unique ID which determines each Xcert smart contract type by its JSON convention.
   * @notice Calculated as keccak256(jsonSchema).
   */
  bytes32 internal nftSchemaId;

  /**
   * @dev Maps NFT ID to proof.
   */
  mapping (uint256 => bytes32) internal idToProof;

  /**
   * @dev Maps address to authorization of contract.
   */
  mapping (address => bool) internal addressToAuthorized;

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftSchemaId, nftName, nftSymbol
   * and uriBase.
   */
  constructor()
    public
  {
    supportedInterfaces[0xc65e10ef] = true; // Xcert
  }

  /**
   * @dev Mints a new Xcert.
   * @param _to The address that will own the minted Xcert.
   * @param _id The Xcert to be minted by the msg.sender.
   * @param _proof Cryptographic asset imprint.
   */
  function mint(
    address _to,
    uint256 _id,
    bytes32 _proof
  )
    external
    hasAbility(ABILITY_TO_MINT_NEW_XCERTS)
  {
    super._mint(_to, _id);
    idToProof[_id] = _proof;
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
   * @dev Returns proof for Xcert.
   * @param _tokenId Id of the Xcert.
   */
  function tokenProof(
    uint256 _tokenId
  )
    external
    view
    returns(bytes32)
  {
    return idToProof[_tokenId];
  }

  /**
   * @dev Change URI base.
   * @param _uriBase New uriBase.
   */
  function setUriBase(
    string _uriBase
  )
    external
    hasAbility(ABILITY_TO_CHANGE_URI_BASE)
  {
    super._setUriBase(_uriBase);
  }
}
