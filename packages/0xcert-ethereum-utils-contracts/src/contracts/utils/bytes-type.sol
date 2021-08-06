// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

/**
 * @title BytesToTypes
 * @dev The BytesToTypes contract converts the memory byte arrays to the standard solidity types.
 * @notice Based on: https://github.com/pouladzade/Seriality/blob/master/src/BytesToTypes.sol
 */
library BytesType
{
  /**
   * @dev Converts bytes to address type.
   * @param _offst Offset from where the conversion starts.
   * @param _input Bytes to convert.
   * @return _output Output the address extracted from memory
   */
  function toAddress(
    uint _offst,
    bytes memory _input
  )
    internal
    pure
  returns (address _output)
  {
    assembly { _output := mload(add(_input, _offst)) } // solhint-disable-line no-inline-assembly
  }

  /**
   * @dev Converts bytes to bool type.
   * @param _offst Offset from where the conversion starts.
   * @param _input Bytes to convert.
   * @param _output The bool extracted from memory
   */
  function toBool(
    uint _offst,
    bytes memory _input
  )
    internal
    pure
    returns (bool _output)
  {
    uint8 x;
    assembly { x := mload(add(_input, _offst)) } // solhint-disable-line no-inline-assembly
    if (x == 0) {
      _output = false;
    } else {
      _output = true;
    }
  }

  /**
   * @dev Converts bytes to bytes32 type.
   * @param _offst Offset from where the conversion starts.
   * @param _input Bytes to convert.
   * @return _output Bytes32 output.
   */
  function toBytes32(
    uint _offst,
    bytes memory _input
  )
    internal
    pure
    returns (bytes32 _output)
  {
    assembly { _output := mload(add(_input, _offst)) } // solhint-disable-line no-inline-assembly
  }

  /**
   * @dev Converts bytes to uint8 type.
   * @param _offst Offset from where the conversion starts.
   * @param _input Bytes to convert.
   * @return _output Uint8 extracted from memory
   */
  function toUint8(
    uint _offst,
    bytes memory _input
  )
    internal
    pure
    returns (uint8 _output)
  {
    assembly { _output := mload(add(_input, _offst)) } // solhint-disable-line no-inline-assembly
  }

  /**
   * @dev Converts bytes to uint16 type.
   * @param _offst Offset from where the conversion starts.
   * @param _input Bytes to convert.
   * @return _output Uint16 extracted from memory.
   */
  function toUint16(
    uint _offst,
    bytes memory _input
  )
    internal
    pure
    returns (uint16 _output)
  {
    assembly { _output := mload(add(_input, _offst)) } // solhint-disable-line no-inline-assembly
  }

  /**
   * @dev Converts bytes to uint256 type.
   * @param _offst Offset from where the conversion starts.
   * @param _input Bytes to convert.
   * @return _output Uint256 extracted from memory.
   */
  function toUint256(
    uint _offst,
    bytes memory _input
  )
    internal
    pure
    returns (uint256 _output)
  {
    assembly { _output := mload(add(_input, _offst)) } // solhint-disable-line no-inline-assembly
  }
}
