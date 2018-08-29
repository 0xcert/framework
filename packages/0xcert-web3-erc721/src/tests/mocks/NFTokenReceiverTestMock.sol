pragma solidity ^0.4.24;

import "../../contracts/ERC721TokenReceiver.sol";

contract NFTokenReceiverTestMock is
  ERC721TokenReceiver
{
  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes _data
  )
    external
    returns(bytes4)
  {
    _operator;
    _from;
    _tokenId;
    _data;
    return 0x150b7a02;
  }
}
