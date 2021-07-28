// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

/**
 * @dev Xcert interface.
 */
interface Xcert // is ERC-721 metadata enumerable, is ERC-2447
{

  /**
   * @dev Creates a new Xcert.
   * @param _to The address that will own the created Xcert.
   * @param _id The Xcert to be created by the msg.sender.
   * @param _imprint Cryptographic asset imprint.
   */
  function create(
    address _to,
    uint256 _id,
    bytes32 _imprint
  )
    external;

  /**
   * @dev Change URI.
   * @param _uriPrefix New URI prefix.
   * @param _uriPostfix New URI postfix.
   */
  function setUri(
    string calldata _uriPrefix,
    string calldata _uriPostfix
  )
    external;

}
