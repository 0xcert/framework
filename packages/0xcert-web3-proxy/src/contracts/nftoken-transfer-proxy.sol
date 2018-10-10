pragma solidity 0.4.25;

import "./iproxy.sol";
import "@0xcert/web3-erc721/src/contracts/ERC721.sol";
import "@0xcert/web3-utils/src/contracts/permission/abilitable.sol";

/** 
 * @title NFTokenTransferProxy - Transfers none-fundgible tokens on behalf of contracts that have 
 * been approved via decentralized governance.
 * @dev based on:https://github.com/0xProject/contracts/blob/master/contracts/TokenTransferProxy.sol
 */
contract NFTokenTransferProxy is 
  Proxy,
  Abilitable 
{
  /**
   * @dev List of abilities:
   * 1 - Ability to execute transfer. 
   */

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
    hasAbility(1)
  {
    ERC721(_target).transferFrom(_a, _b, _c);
  }
}