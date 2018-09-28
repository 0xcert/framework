pragma solidity 0.4.25;

import "./iproxy.sol";
import "@0xcert/web3-erc721/src/contracts/ERC721.sol";
import "@0xcert/ethereum-utils/contracts/ownership/Claimable.sol";

/** 
 * @title NFTokenTransferProxy - Transfers none-fundgible tokens on behalf of contracts that have 
 * been approved via decentralized governance.
 * @dev based on:https://github.com/0xProject/contracts/blob/master/contracts/TokenTransferProxy.sol
 */
contract NFTokenTransferProxy is 
  Proxy,
  Claimable 
{
  /**
   * @dev Error constants.
   */
  string constant TARGET_AUTHORIZED = "11001";
  string constant TARGET_NOT_AUTHORIZED = "11002";

  /**
   * @dev Only if target is authorized you can invoke functions with this modifier.
   */
  modifier targetAuthorized(
    address target
  )
  {
    require(authorized[target], TARGET_NOT_AUTHORIZED);
    _;
  }

  /**
   * @dev Only if target is not autorized you can invoke functions with this modifier.
   */
  modifier targetNotAuthorized(
    address target
  )
  {
    require(!authorized[target], TARGET_AUTHORIZED);
    _;
  }

  /**
   * @dev mapping of address to boolean state if authorized.
   */
  mapping (address => bool) public authorized;

  /**
   * @dev list of authorized addresses.
   */
  address[] public authorities;

  /**
   * @dev This emmits when a new address gets authorized.
   */
  event LogAuthorizedAddressAdded(
    address indexed _target,
    address indexed _caller
  );

  /**
   * @dev This emmits when an address gets its authorization revoked.
   */
  event LogAuthorizedAddressRemoved(
    address indexed _target,
    address indexed _caller
  );

  /**
   * @dev Authorizes an address.
   * @param _target Address to authorize.
   */
  function addAuthorizedAddress(
    address _target
  )
    external
    onlyOwner
    targetNotAuthorized(_target)
  {
    authorized[_target] = true;
    authorities.push(_target);
    emit LogAuthorizedAddressAdded(_target, msg.sender);
  }

  /**
   * @dev Removes authorizion of an address.
   * @param _target Address to remove authorization from.
   */
  function removeAuthorizedAddress(
    address _target
  )
    external
    onlyOwner
    targetAuthorized(_target)
  {
    delete authorized[_target];
    for (uint i = 0; i < authorities.length; i++) {
      if (authorities[i] == _target) {
        authorities[i] = authorities[authorities.length - 1];
        authorities.length -= 1;
        break;
      }
    }
    emit LogAuthorizedAddressRemoved(_target, msg.sender);
  }

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
    targetAuthorized(msg.sender)
  {
    ERC721(_target).transferFrom(_a, _b, _c);
  }

  /**
   * @dev Gets all authorized addresses.
   * @return Array of authorized addresses.
   */
  function getAuthorizedAddresses()
    external
    view
    returns (address[])
  {
    return authorities;
  }
}