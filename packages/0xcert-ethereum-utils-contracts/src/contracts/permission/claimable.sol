pragma solidity ^0.5.1;

import "./ownable.sol";

/**
 * @dev The contract has an owner address, and provides basic authorization control whitch
 * simplifies the implementation of user permissions. This contract is based on the source code
 * at goo.gl/CfEAkv and upgrades Ownable contracts with additional claim step which makes ownership
 * transfers less prone to errors.
 */
contract Claimable is
  Ownable
{

  /**
   * @dev Error constants.
   */
  string constant NOT_PENDING_OWNER = "019001";

  /**
   * @dev Address of pending owner or zero address if there is no pending owner.
   */
  address public pendingOwner;

  /**
   * @dev An event which is triggered when the owner is changed.
   * @param previousOwner The address of the previous owner.
   * @param newOwner The address of the new owner.
   */
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  /**
   * @dev Allows the current owner to give new owner ability to claim the ownership of the contract.
   * This differs from the Owner's function in that it allows setting pedingOwner address to 0x0,
   * which effectively cancels an active claim.
   * @param _newOwner The address which can claim ownership of the contract.
   */
  function transferOwnership(
    address _newOwner
  )
    public
    onlyOwner
  {
    pendingOwner = _newOwner;
  }

  /**
   * @dev Allows the current pending owner to claim the ownership of the contract. It emits
   * OwnershipTransferred event and resets pending owner to 0.
   */
  function claimOwnership()
    public
  {
    require(msg.sender == pendingOwner, NOT_PENDING_OWNER);
    address previousOwner = owner;
    owner = pendingOwner;
    pendingOwner = address(0);
    emit OwnershipTransferred(previousOwner, owner);
  }
  
}
