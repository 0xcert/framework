// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "../ierc-2477.sol";
import "../ixcert.sol";
import "../ixcert-burnable.sol";
import "../ixcert-mutable.sol";
import "../ixcert-pausable.sol";
import "../ixcert-revokable.sol";

/**
 * @dev This contracts calculates interface id of Xcert contracts as described in EIP165:
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-165.md.
 * @notice See test folder for usage examples.
 */
contract Selector
{

  /**
   * @dev Calculates and returns interface ID for the erc2477 smart contract.
   */
  function calculateERC2477Selector()
    external
    pure
    returns (bytes4)
  {
    return type(ERC2477).interfaceId;
  }

  /**
   * @dev Calculates and returns interface ID for the Xcert smart contract.
   */
  function calculateXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return type(Xcert).interfaceId;
  }

  /**
   * @dev Calculates and returns interface ID for the destroyable Xcert smart contract.
   */
  function calculateDestroyableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return type(XcertBurnable).interfaceId;
  }

  /**
   * @dev Calculates and returns interface ID for the revokable Xcert smart contract.
   */
  function calculateRevokableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return type(XcertRevokable).interfaceId;
  }

  /**
   * @dev Calculates and returns interface ID for the revokable Xcert smart contract.
   */
  function calculateMutableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return type(XcertMutable).interfaceId;
  }

  /**
   * @dev Calculates and returns interface ID for the pausable Xcert smart contract.
   */
  function calculatePausableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return type(XcertPausable).interfaceId;
  }

}