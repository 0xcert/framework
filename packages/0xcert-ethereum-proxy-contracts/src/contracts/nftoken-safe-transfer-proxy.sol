pragma solidity 0.5.1;

import "./iproxy.sol";
import "@0xcert/ethereum-erc721-contracts/src/contracts/erc721.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

/** 
 * @title NFTokenTransferProxy - Transfers none-fundgible tokens on behalf of contracts that have 
 * been approved via decentralized governance.
 * @dev based on:https://github.com/0xProject/contracts/blob/master/contracts/TokenTransferProxy.sol
 */
contract NFTokenSafeTransferProxy is 
  Proxy,
  Abilitable 
{

  /**
   * @dev List of abilities:
   * 1 - Ability to execute. 
   */
  uint8 constant ABILITY_TO_EXECUTE = 1;

  /**
   * @dev Transfers a NFT.
   * @param _target Address of NFT contract.
   * @param _a Address from which the NFT will be sent.
   * @param _b Address to which the NFT will be sent.
   * @param _c Id of the NFT being sent.
   */
  function execute(
    address _target,
    address _a,
    address _b,
    uint256 _c
  )
    external
    hasAbility(ABILITY_TO_EXECUTE)
  {
    ERC721(_target).safeTransferFrom(_a, _b, _c);
  }
  
}