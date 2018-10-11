pragma solidity ^0.4.25;

import "@0xcert/web3-utils/src/contracts/math/safe-math.sol";
import "@0xcert/web3-utils/src/contracts/permission/abilitable.sol";
import "@0xcert/web3-utils/src/contracts/utils/address-utils.sol";
import "@0xcert/web3-erc721/src/contracts/nf-token-metadata-enumerable.sol";

/**
 * @dev Xcert implementation.
 */
contract Xcert is 
  NFTokenMetadataEnumerable,
  Abilitable
{
  /**
   * @dev List of abilities gathered from all extensions:
   * 1 - Ability to mint new xcerts.
   * 2 - Ability to revoke xcerts.
   * 3 - Ability to pause xcert transfers.
   * 4 - Ability to change xcert proof.
   * 5 - Ability to sign claims (valid signatures for minter).
   * 6 - Ability to change URI base.
   */

  using SafeMath for uint256;
  using AddressUtils for address;

  /**
   * @dev Error constants.
   */
  string constant EMPTY_PROOF = "007001";

  /**
   * @dev Unique ID which determines each Xcert smart contract type by its JSON convention.
   * @notice Calculated as keccak256(jsonSchema).
   */
  bytes32 internal nftConventionId;

  /**
   * @dev Maps NFT ID to proof.
   */
  mapping (uint256 => string) internal idToProof;

  /**
   * @dev Maps address to authorization of contract.
   */
  mapping (address => bool) internal addressToAuthorized;

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftConventionId, nftName, nftSymbol
   * and uriBase.
   */
  constructor()
    public
  {
    supportedInterfaces[0x53e8e3f4] = true; // Xcert
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
    string _proof
  )
    external
    hasAbility(1)
  {
    require(bytes(_proof).length > 0, EMPTY_PROOF);
    super._mint(_to, _id);
    idToProof[_id] = _proof;
  }

  /**
   * @dev Returns a bytes4 of keccak256 of json schema representing 0xcert protocol convention.
   */
  function conventionId()
    external
    view
    returns (bytes32 _conventionId)
  {
    _conventionId = nftConventionId;
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
    returns(string)
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
    hasAbility(6)
  {
    super._setUriBase(_uriBase);
  }
}
