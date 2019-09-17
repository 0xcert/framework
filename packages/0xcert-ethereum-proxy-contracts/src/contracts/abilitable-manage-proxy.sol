pragma solidity 0.5.6;

import "./iproxy.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

/**
 * @title AbilitableManageProxy - Manages abilities on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract AbilitableManageProxy is
  Abilitable
{

  /**
   * @dev List of abilities:
   * 16 - Ability to execute transfer. 
   */
  uint8 constant ABILITY_TO_EXECUTE = 16;

  /**
   * @dev Calls into Abilitable contract, invoking grantAbilities.
   * @param _target Address of abilitable smart contract.
   * @param _to Account to which we are granting abilities.
   * @param _abilities Number representing bitfield of abilities we are granting.
   */
  function set(
    address _target,
    address _to,
    uint256 _abilities,
    bool _allowSuperRevoke
  )
    public
    hasAbilities(ABILITY_TO_EXECUTE)
  {
    Abilitable(_target).setAbilities(_to, _abilities, _allowSuperRevoke);
  }
  
}
