// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@0xcert/ethereum-xcert-contracts/src/contracts/ixcert.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

/**
 * @title XcertCreateProxy - creates a token on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract XcertCreateProxy is
  Abilitable
{

  /**
   * @dev List of abilities:
   * 16 - Ability to execute create.
   */
  uint8 constant ABILITY_TO_EXECUTE = 16;

  /**
   * @dev Creates a new Xcert.
   * @param _xcert Address of the Xcert contract on which the creation will be performed.
   * @param _to The address that will own the created Xcert.
   * @param _id The Xcert to be created by the msg.sender.
   * @param _tokenURIIntegrityDigest Cryptographic asset URI integrity digest.
   */
  function create(
    address _xcert,
    address _to,
    uint256 _id,
    bytes32 _tokenURIIntegrityDigest
  )
    external
    hasAbilities(ABILITY_TO_EXECUTE)
  {
    Xcert(_xcert).create(_to, _id, _tokenURIIntegrityDigest);
  }

}
