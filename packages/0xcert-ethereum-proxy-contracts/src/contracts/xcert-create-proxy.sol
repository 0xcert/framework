pragma solidity 0.5.1;

import "@0xcert/ethereum-xcert-contracts/src/contracts/xcert.sol";
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
   * 1 - Ability to execute create. 
   */
  uint8 constant ABILITY_TO_EXECUTE = 1;

  /**
   * @dev Creates a new NFT.
   * @param _xcert Address of the Xcert contract on which the creation will be perfomed.
   * @param _to The address that will own the created NFT.
   * @param _id The NFT to be created by the msg.sender.
   * @param _imprint Cryptographic asset imprint.
   */
  function create(
    address _xcert,
    address _to,
    uint256 _id,
    bytes32 _imprint
  )
    external
    hasAbility(ABILITY_TO_EXECUTE)
  {
    Xcert(_xcert).create(_to, _id, _imprint);
  }
  
}