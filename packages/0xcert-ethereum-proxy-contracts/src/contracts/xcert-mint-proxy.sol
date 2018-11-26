pragma solidity 0.4.25;

import "@0xcert/ethereum-xcert-contracts/src/contracts/xcert.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

/**
 * @title XcertMintProxy - Mints a token on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract XcertMintProxy is 
  Abilitable 
{
  /**
   * @dev List of abilities:
   * 1 - Ability to execute mint. 
   */
  uint8 constant ABILITY_TO_EXECUTE = 1;

  /**
   * @dev Mints a new NFT.
   * @param _xcert Address of the Xcert contract on which the mint will be perfomed.
   * @param _to The address that will own the minted NFT.
   * @param _id The NFT to be minted by the msg.sender.
   * @param _proof Cryptographic asset imprint.
   */
  function mint(
    address _xcert,
    address _to,
    uint256 _id,
    bytes32 _proof
  )
    external
    hasAbility(ABILITY_TO_EXECUTE)
  {
    Xcert(_xcert).mint(_to, _id, _proof);
  }
}