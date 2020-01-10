pragma solidity 0.6.1;

import "../../contracts/mocks/nf-token-metadata-mock.sol";

contract NFTokenMetadataTestMock is
  NFTokenMetadataMock
{

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriPrefix,
    string memory _uriPostfix
  )
    NFTokenMetadataMock(_name, _symbol, _uriPrefix, _uriPostfix)
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
    override
    onlyOwner
  {
    super._destroy(_tokenId);
  }

}
