pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

contract Example{

  struct Data0 {
    uint8 val0;
  }

  struct Data1 {
    string val0;
    uint8 val1;
    uint16 val2;
    uint32 val3;
    uint64 val4;
    uint128 val5;
    uint256 val6;
    bytes8 val7;
    bytes32 val8;
    bool val9;
    address val10;
  }
  
  struct Data2 {
    string val0;
    Data1[] val1;
  }

  string val0;
  uint8 val1;
  uint16 val2;
  uint32 val3;
  uint64 val4;
  uint128 val5;
  uint256 val6;
  uint256[] val6a;
  bytes8 val7;
  bytes32 val8;
  bool val9;
  address val10;
  Data0 data0;
  Data1 data1;
  Data2 data2;
      
  function getString(string _val0) public pure returns(string)
  {
    return _val0;
  }

  function getUint8(uint8 _val1) public pure returns(uint8)
  {
    return _val1;
  }

  function getUint16(uint16 _val2) public pure returns(uint16)
  {
    return _val2;
  }

  function getUint32(uint32 _val3) public pure returns(uint32)
  {
    return _val3;
  }

  function getUint64(uint64 _val4) public pure returns(uint64)
  {
    return _val4;
  }

  function getUint128(uint128 _val5) public pure returns(uint128)
  {
    return _val5;
  }

  function getUint256(uint256 _val6) public pure returns(uint256)
  {
    return _val6;
  }

  function getBytes8(bytes8 _val7) public pure returns(bytes8)
  {
    return _val7;
  }

  function getBytes32(bytes32 _val8) public pure returns(bytes32)
  {
    return _val8;
  }

  function getBool(bool _val9) public pure returns(bool)
  {
    return _val9;
  }

  function getAddress(address _val10) public pure returns(address)
  {
    return _val10;
  }

  function getStruc0(Data0 _val0) public pure returns(Data0)
  {
    return _val0;
  }

  function getStruct1(Data1 _val1) public pure returns(Data1)
  {
    return _val1;
  }

  function getStruct1(Data2 _val2) public pure returns(Data2)
  {
    return _val2;
  }

  function setString(string _val0) public returns(string)
  {
    return val0 = _val0;
  }

  function setUint8(uint8 _val1) public returns(uint8)
  {
    return val1 = _val1;
  }

  function setUint16(uint16 _val2) public returns(uint16)
  {
    return val2 = _val2;
  }

  function setUint32(uint32 _val3) public returns(uint32)
  {
    return val3 = _val3;
  }

  function setUint64(uint64 _val4) public returns(uint64)
  {
    return val4 = _val4;
  }

  function setUint128(uint128 _val5) public returns(uint128)
  {
    return val5 = _val5;
  }

  function setUint256(uint256 _val6) public returns(uint256)
  {
    return val6 = _val6;
  }
  
  function setUint256a(uint256[] _val6) public returns(uint256[])
  {
    return val6a = _val6;
  }

  function setBytes8(bytes8 _val7) public returns(bytes8)
  {
    return val7 = _val7;
  }

  function setBytes32(bytes32 _val8) public returns(bytes32)
  {
    return val8 = _val8;
  }

  function setBool(bool _val9) public returns(bool)
  {
    return val9 = _val9;
  }

  function setAddress(address _val10) public returns(address)
  {
    return val10 = _val10;
  }

  function setStruc0(Data0 _val0) public returns(Data0)
  {
    return data0 = _val0;
  }

  function setStruc0(Data1 _val1) public returns(Data1)
  {
    return data1 = _val1;
  }

  function setStruct1(Data2 _val2) public returns(Data2)
  {
    data2.val0 = _val2.val0;
    for(uint256 i = 0; i < _val2.val1.length; i++)
    {
      data2.val1[i] = _val2.val1[i];
    }
    return data2;
  }

}
