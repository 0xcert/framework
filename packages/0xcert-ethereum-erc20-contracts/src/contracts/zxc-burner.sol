// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "./zxc.sol";

/**
 * @title This is a contract that allows anyone to burn ZXC tokens.
 * @dev This contract has ownership over ZXC smart contract and as such allows anyone to burn their
 * ZXC tokens.
 */
contract ZxcBurner
{
  /**
   * @dev ZXC token contract.
   */
  Zxc zxcToken;

  /**
   * @param _zxcAddress ZXC contract address.
   */
  constructor(address _zxcAddress)
  {
    zxcToken = Zxc(_zxcAddress);
  }

  /**
   * @dev Claims ownership of ZXC token contract.
    */
  function claim()
    external
  {
    zxcToken.claimOwnership();
  }

  /**
   * @dev Allows anyone to burn tokens that they own. First you need to approve this contract for
   * token amount then call this function with the amount you want to burn.
   * @param _value Amount of tokens you want to burn.
   */
  function burn(
    uint256 _value
  )
    external
  {
    zxcToken.transferFrom(msg.sender, address(this), _value);
    zxcToken.burn(_value);
  }
}
