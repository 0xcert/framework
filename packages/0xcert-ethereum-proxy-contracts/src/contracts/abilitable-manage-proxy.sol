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
   * 2 - Ability to execute transfer. 
   */
  uint8 constant ABILITY_TO_EXECUTE = 2;

  /**
   * @dev Calls into Abilitable contract, invoking grantAbilities.
   * @param _target Address of abilitable smart contract.
   * @param _to Account to which we are granting abilities.
   * @param _abilities Number representing bitfield of abilities we are granting.
   */
  function grant(
    address _target,
    address _to,
    uint256 _abilities
  )
    public
    hasAbilities(ABILITY_TO_EXECUTE)
  {
    Abilitable(_target).grantAbilities(_to, _abilities);
  }

  /**
   * @dev Calls into Abilitable contract, invoking revokeAbilities.
   * @param _target Address of token to transfer.
   * @param _to Account to which we are revoking abilities.
   * @param _abilities Number representing bitfield of abilities we are revoking.
   * @param _allowSuperRevoke dditional check that prevents you from removing your own super
   * ability by mistake.
   */
  function revoke(
    address _target,
    address _to,
    uint256 _abilities,
    bool _allowSuperRevoke
  )
    public
    hasAbilities(ABILITY_TO_EXECUTE)
  {
    Abilitable(_target).revokeAbilities(_to, _abilities, _allowSuperRevoke);
  }
  
}
