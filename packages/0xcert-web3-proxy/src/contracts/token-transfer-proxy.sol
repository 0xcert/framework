pragma solidity 0.4.24;

import "@0xcert/ethereum-erc20/contracts/tokens/ERC20.sol";
import "@0xcert/ethereum-utils/contracts/ownership/Claimable.sol";

/**
 * @title TokenTransferProxy - Transfers tokens on behalf of contracts that have been approved via
 * decentralized governance.
 * @dev Based on:https://github.com/0xProject/contracts/blob/master/contracts/TokenTransferProxy.sol
 */
contract TokenTransferProxy is 
  Claimable 
{
  /**
   * @dev Error constants.
   */
  string constant TARGET_AUTHORIZED = "11001";
  string constant TARGET_NOT_AUTHORIZED = "11002";

  /**
   * @dev Only if target is autorized you can invoke functions with this modifier.
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
    address indexed target,
    address indexed caller
  );

  /**
   * @dev This emmits when an address gets its authorization revoked.
   */
  event LogAuthorizedAddressRemoved(
    address indexed target,
    address indexed caller
  );

  /**
   * @dev Authorizes an address.
   * @param _target Address to authorize.
   */
  function addAuthorizedAddress(
    address _target
  )
    public
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
    public
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
   * @dev Calls into ERC20 Token contract, invoking transferFrom.
   * @param _token Address of token to transfer.
   * @param _from Address to transfer token from.
   * @param _to Address to transfer token to.
   * @param _value Amount of token to transfer.
   */
  function transferFrom(
    address _token,
    address _from,
    address _to,
    uint256 _value
  )
    public
    targetAuthorized(msg.sender)
    returns (bool)
  {
    return ERC20(_token).transferFrom(_from, _to, _value);
  }

  /**
   * @dev Gets all authorized addresses.
   * @return Array of authorized addresses.
   */
  function getAuthorizedAddresses()
    public
    view
    returns (address[])
  {
    return authorities;
  }
}