// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

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
   * @dev Calculates and returns interface ID for the Xcert smart contract.
   */
  function calculateXcertSelector()
    external
    pure
    returns (bytes4)
  {
    Xcert i;
    return (i.create.selector ^ i.setUri.selector);
  }

  /**
   * @dev Calculates and returns interface ID for the destroyable Xcert smart contract.
   */
  function calculateDestroyableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    XcertBurnable i;
    return i.destroy.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the revokable Xcert smart contract.
   */
  function calculateRevokableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    XcertRevokable i;
    return i.revoke.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the revokable Xcert smart contract.
   */
  function calculateMutableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    XcertMutable i;
    return i.updateTokenURIIntegrityDigest.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the pausable Xcert smart contract.
   */
  function calculatePausableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    XcertPausable i;
    return i.setPause.selector;
  }

}