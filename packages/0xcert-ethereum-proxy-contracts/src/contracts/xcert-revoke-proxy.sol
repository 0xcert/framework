pragma solidity 0.5.11;

import "@0xcert/ethereum-xcert-contracts/src/contracts/ixcert-revokable.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

/**
 * @title XcertRevokeProxy - revokes a token on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract XcertRevokeProxy is
  Abilitable
{

  /**
   * @dev List of abilities:
   * 16 - Ability to execute create.
   */
  uint8 constant ABILITY_TO_EXECUTE = 16;

  /**
   * @dev Revokes an Xcert token.
   * @param _xcert Address of the Xcert contract on which the revoke will be perfomed.
   * @param _id The Xcert we will revoke.
   */
  function revoke(
    address _xcert,
    uint256 _id
  )
    external
    hasAbilities(ABILITY_TO_EXECUTE)
  {
    XcertRevokable(_xcert).revoke(_id);
  }

}
