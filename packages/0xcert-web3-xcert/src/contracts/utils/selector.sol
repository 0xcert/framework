pragma solidity ^0.4.24;

import "../xcert.sol";

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
      ^ i.updateTokenProof.selector
      ^ i.setAuthorizedAddress.selector
      ^ i.isAuthorizedAddress.selector
    );
  }
}