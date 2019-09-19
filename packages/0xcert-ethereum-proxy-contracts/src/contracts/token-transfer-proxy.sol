pragma solidity 0.5.6;

import "./iproxy.sol";
import "@0xcert/ethereum-erc20-contracts/src/contracts/erc20.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

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
   * 16 - Ability to execute transfer. 
   */
  uint8 constant ABILITY_TO_EXECUTE = 16;

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
    hasAbilities(ABILITY_TO_EXECUTE)
  {
    require(
      ERC20(_target).transferFrom(_a, _b, _c),
      TRANSFER_FAILED
    );
  }
  
}
