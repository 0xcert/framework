
// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

/**
 * @dev Utility library of inline functions on addresses.
 */
library AddressUtils
{

  /**
   * @dev Returns whether the target address is a deployed contract.
   * If a contract constructor calls this method with its own address the returned value
   * will be false. If you want to check if an address is a contract (in whatever state) you can do
   * so using extcodehash after constantinople fork.
   * @param _addr Address to check.
   * @return addressCheck True if _addr is a deployed contract, false if not.
   */
  function isDeployedContract(
    address _addr
  )
    internal
    view
    returns (bool addressCheck)
  {
    uint256 size;
    assembly { size := extcodesize(_addr) } // solhint-disable-line
    addressCheck = size > 0;
  }

}
