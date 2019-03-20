pragma solidity 0.5.6;

import "../../contracts/mocks/nf-token-mock.sol";

contract NFTokenTestMock is
  NFTokenMock
{

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
