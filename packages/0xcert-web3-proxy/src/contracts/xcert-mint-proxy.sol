pragma solidity 0.4.25;

import "@0xcert/web3-xcert/src/contracts/xcert.sol";
import "@0xcert/ethereum-utils/contracts/ownership/Claimable.sol";

/**
 * @title XcertMintProxy - Mints a token on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract XcertMintProxy is 
  Claimable 
{
  /**
   * @dev Error constants.
   */
  string constant TARGET_AUTHORIZED = "014001";
  string constant TARGET_NOT_AUTHORIZED = "014002";

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
   * @dev Mints a new NFT.
   * @param _xcert Address of the Xcert contract on which the mint will be perfomed.
   * @param _to The address that will own the minted NFT.
   * @param _id The NFT to be minted by the msg.sender.
   * @param _uri An URI pointing to NFT metadata.
   * @param _proof Cryptographic asset imprint.
   */
  function mint(
    address _xcert,
    address _to,
    uint256 _id,
    string _uri,
    string _proof
  )
    external
    targetAuthorized(msg.sender)
  {
    Xcert(_xcert).mint(_to, _id, _uri, _proof);
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