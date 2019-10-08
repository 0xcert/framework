pragma solidity 0.5.11;

import "../../contracts/utils/bytes-to-types.sol";

contract UnpackTestMock is
  BytesToTypes
{

  // Expecting 109-byte input
  function unpack(
    bytes calldata _input
  )
    external
    pure
    returns (address p1, bool p2, bytes32 p3, uint8 p4, uint16 p5, uint256 p6)
  {
    uint8 offset = 88;
    p1 = bytesToAddress(offset, _input);
    offset -= 20;
    p2 = bytesToBool(offset, _input);
    offset -= 1;
    p3 = bytesToBytes32(offset, _input);
    offset -= 32;
    p4 = bytesToUint8(offset, _input);
    offset -= 1;
    p5 = bytesToUint16(offset, _input);
    offset -= 2;
    p6 = bytesToUint256(offset, _input);
  }

}
