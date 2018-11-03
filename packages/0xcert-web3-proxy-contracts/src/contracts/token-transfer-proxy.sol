pragma solidity 0.4.25;

import "./iproxy.sol";
import "@0xcert/web3-erc20-contracts/src/contracts/ERC20.sol";
import "@0xcert/web3-utils-contracts/src/contracts/permission/abilitable.sol";

/**
 * @title TokenTransferProxy - Transfers tokens on behalf of contracts that have been approved via
 * decentralized governance.
 * @dev Based on:https://github.com/0xProject/contracts/blob/master/contracts/TokenTransferProxy.sol
 */
contract TokenTransferProxy is 
  Proxy,
  Abilitable 
{
  /**
   * @dev List of abilities:
   * 1 - Ability to execute transfer. 
   */

  /**
   * @dev Error constants.
   */
  string constant TRANSFER_FAILED = "012001";

  /**
   * @dev Calls into ERC20 Token contract, invoking transferFrom.
   * @param _target Address of token to transfer.
   * @param _a Address to transfer token from.
   * @param _b Address to transfer token to.
   * @param _c Amount of token to transfer.
   */
  function execute(
    address _target,
    address _a,
    address _b,
    uint256 _c
  )
    public
    hasAbility(1)
  {
    require(
      ERC20(_target).transferFrom(_a, _b, _c),
      TRANSFER_FAILED
    );
  }
}