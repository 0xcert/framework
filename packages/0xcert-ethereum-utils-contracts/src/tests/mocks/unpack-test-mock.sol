pragma solidity 0.8.6;

import "../../contracts/utils/bytes-type.sol";

contract UnpackTestMock
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
    p1 = BytesType.toAddress(offset, _input);
    offset -= 20;
    p2 = BytesType.toBool(offset, _input);
    offset -= 1;
    p3 = BytesType.toBytes32(offset, _input);
    offset -= 32;
    p4 = BytesType.toUint8(offset, _input);
    offset -= 1;
    p5 = BytesType.toUint16(offset, _input);
    offset -= 2;
    p6 = BytesType.toUint256(offset, _input);
  }

}
