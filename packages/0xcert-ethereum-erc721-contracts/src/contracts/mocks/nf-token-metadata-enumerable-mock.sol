pragma solidity 0.5.6;

import "../nf-token-metadata-enumerable.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/claimable.sol";

/**
 * @dev This is an example contract implementation of NFToken with enumerable and metadata
 * extensions.
 */
contract NFTokenMetadataEnumerableMock is
  NFTokenMetadataEnumerable,
  Claimable
{
  
  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFTokens.
   * @param _uriBase Base of uri for token metadata uris. 
   * @param _uriPostfix Postfix of URI for token metadata URIs. 
   */
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriBase,
    string memory _uriPostfix
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
    uriBase = _uriBase;
    uriPostfix = _uriPostfix;
  }

  /**
   * @dev Creates a new NFT.
   * @param _to The address that will own the created NFT.
   * @param _tokenId of the NFT to be created by the msg.sender.
   */
  function create(
    address _to,
    uint256 _tokenId
  )
    external
    onlyOwner
  {
    super._create(_to, _tokenId);
  }

  /**
   * @dev Change URI base.
   * @param _uriBase New uriBase.
   */
  function setUriBase(
    string calldata _uriBase
  )
    external
    onlyOwner
  {
    super._setUriBase(_uriBase);
  }

  /**
   * @dev Change URI postfix.
   * @param _uriPostfix New uriPostfix.
   */
  function setUriPostfix(
    string calldata _uriPostfix
  )
    external
    onlyOwner
  {
    super._setUriPostfix(_uriPostfix);
  }

}
