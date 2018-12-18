pragma solidity ^0.5.1;

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
      i.create.selector
      ^ i.schemaId.selector
      ^ i.tokenImprint.selector
      ^ i.setUriBase.selector
      ^ i.assignAbilities.selector
      ^ i.revokeAbilities.selector
      ^ i.isAble.selector
    );
  }

  /**
   * @dev Calculates and returns interface ID for the destroyable Xcert smart contract.
   */
  function calculateDestroyableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    Xcert i;
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
    Xcert i;
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
    Xcert i;
    return i.updateTokenImprint.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the pausable Xcert smart contract.
   */
  function calculatePausableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    Xcert i;
    return i.setPause.selector;
  }
}