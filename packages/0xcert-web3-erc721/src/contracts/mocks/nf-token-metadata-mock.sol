pragma solidity ^0.4.25;

import "../nf-token-metadata.sol";
import "@0xcert/web3-utils/src/contracts/permission/claimable.sol";

/**
 * @dev This is an example contract implementation of NFToken with metadata extension.
 */
contract NFTokenMetadataMock is
  NFTokenMetadata,
  Claimable
{
  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFTokens.
   * @param _uriBase Base of uri for token metadata uris. 
   */
  constructor(
    string _name,
    string _symbol,
    string _uriBase
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
    uriBase = _uriBase;
  }

  /**
   * @dev Mints a new NFT.
   * @param _to The address that will own the minted NFT.
   * @param _tokenId of the NFT to be minted by the msg.sender.
   */
  function mint(
    address _to,
    uint256 _tokenId
  )
    external
    onlyOwner
  {
    super._mint(_to, _tokenId);
  }

  /**
   * @dev Removes a NFT from owner.
   * @param _tokenId Which NFT we want to remove.
   */
  function burn(
    uint256 _tokenId
  )
    external
    onlyOwner
  {
    super._burn(_tokenId);
  }

  /**
   * @dev Change URI base.
   * @param _uriBase New uriBase.
   */
  function setUriBase(
    string _uriBase
  )
    external
    onlyOwner
  {
    super._setUriBase(_uriBase);
  }
}
