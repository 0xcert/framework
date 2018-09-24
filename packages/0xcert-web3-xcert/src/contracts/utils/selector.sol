pragma solidity ^0.4.24;

import "../xcert.sol";
import "../burnable-xcert.sol";
import "../revokable-xcert.sol";
import "../mutable-xcert.sol";

/**
 * @dev This contracts calculates interface id of Xcert contracts as described in EIP165:
 * http://tiny.cc/uo23ty.
 * @notice See test folder for usage examples.
 */
contract Selector {

  /**
   * @dev Calculates and returns interface ID for the Xcert smart contract.
   */
  function calculateXcertSelector()
    external
    pure
    returns (bytes4)
  {
    Xcert i;
    return (
      i.mint.selector
      ^ i.conventionId.selector
      ^ i.tokenProof.selector
      ^ i.setAuthorizedAddress.selector
      ^ i.isAuthorizedAddress.selector
    );
  }

  /**
   * @dev Calculates and returns interface ID for the burnable Xcert smart contract.
   */
  function calculateBurnableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    BurnableXcert i;
    return i.burn.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the revokable Xcert smart contract.
   */
  function calculateRevokableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    RevokableXcert i;
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
    MutableXcert i;
    return i.updateTokenProof.selector;
  }
}