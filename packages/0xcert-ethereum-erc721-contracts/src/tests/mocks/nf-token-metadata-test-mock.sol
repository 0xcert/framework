pragma solidity 0.5.6;

import "../../contracts/mocks/nf-token-metadata-mock.sol";

contract NFTokenMetadataTestMock is
  NFTokenMetadataMock
{

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriBase,
    string memory _uriPostfix
  )
    NFTokenMetadataMock(_name, _symbol, _uriBase, _uriPostfix)
    public
  {}
  
  /**
   * @dev Removes a NFT from owner.
   * @param _tokenId Which NFT we want to remove.
   */
  function destroy(
    uint256 _tokenId
  )
    external
    onlyOwner
  {
    super._destroy(_tokenId);
  }
  
}
