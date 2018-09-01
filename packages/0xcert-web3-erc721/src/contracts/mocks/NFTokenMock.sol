pragma solidity ^0.4.24;

import "../NFToken.sol";
import "@0xcert/ethereum-utils/contracts/ownership/Claimable.sol";

/**
 * @dev This is an example contract implementation of NFToken.
 */
contract NFTokenMock is
  NFToken,
  Claimable
{
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
}
