pragma solidity ^0.4.24;

import "@0xcert/ethereum-utils/contracts/math/SafeMath.sol";
import "@0xcert/ethereum-utils/contracts/ownership/Claimable.sol";
import "@0xcert/ethereum-utils/contracts/utils/AddressUtils.sol";
import "@0xcert/web3-erc721/src/contracts/NFTokenMetadataEnumerable.sol";

/**
 * @dev Xcert implementation.
 */
contract Xcert is 
  NFTokenMetadataEnumerable,
  Claimable
{
  using SafeMath for uint256;
  using AddressUtils for address;

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
   * @dev Emits when an address is authorized to some contract control or the authorization is 
   * revoked. The _target has some contract controle like minting new Xcerts.
   * @param _target Address to set authorized state.
   * @param _authorized True if the _target is authorised, false to revoke authorization.
   */
  event AuthorizedAddress(
    address indexed _target,
    bool _authorized
  );

  /**
   * @dev Guarantees that msg.sender is allowed to mint a new Xcert.
   */
  modifier isAuthorized() {
    require(msg.sender == owner || addressToAuthorized[msg.sender]);
    _;
  }

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftConventionId, nftName and
   * nftSymbol.
   */
  constructor()
    public
  {
    supportedInterfaces[0x55bee7a4] = true; // Xcert
  }

  /**
   * @dev Mints a new Xcert.
   * @param _to The address that will own the minted Xcert.
   * @param _id The Xcert to be minted by the msg.sender.
   * @param _uri An URI pointing to Xcert metadata.
   * @param _proof Cryptographic asset imprint.
   */
  function mint(
    address _to,
    uint256 _id,
    string _uri,
    string _proof
  )
    external
    isAuthorized()
  {
    require(bytes(_proof).length > 0);
    super._mint(_to, _id, _uri);
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
   * @dev Sets authorised address for minting.
   * @param _target Address to set authorized state.
   * @param _authorized True if the _target is authorised, false to revoke authorization.
   */
  function setAuthorizedAddress(
    address _target,
    bool _authorized
  )
    external
    onlyOwner
  {
    require(_target != address(0));
    addressToAuthorized[_target] = _authorized;
    emit AuthorizedAddress(_target, _authorized);
  }

  /**
   * @dev Sets mint authorised address.
   * @param _target Address for which we want to check if it is authorized.
   * @return Is authorized or not.
   */
  function isAuthorizedAddress(
    address _target
  )
    external
    view
    returns (bool)
  {
    require(_target != address(0));
    return addressToAuthorized[_target];
  }
}
