pragma solidity 0.6.2;

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
    return (
      Xcert.create.selector
      ^ Xcert.schemaId.selector
      ^ Xcert.tokenImprint.selector
      ^ Xcert.setUri.selector
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
    return XcertBurnable.destroy.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the revokable Xcert smart contract.
   */
  function calculateRevokableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return XcertRevokable.revoke.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the revokable Xcert smart contract.
   */
  function calculateMutableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return XcertMutable.updateTokenImprint.selector;
  }

  /**
   * @dev Calculates and returns interface ID for the pausable Xcert smart contract.
   */
  function calculatePausableXcertSelector()
    external
    pure
    returns (bytes4)
  {
    return XcertPausable.setPause.selector;
  }
  
}
