pragma solidity 0.5.1;

import "../math/safe-math.sol";

/**
 * @title Contract for setting abilities.
 * @dev For optimization purposes the abilities are represented as a bitfield. Maximum number of
 * abilities is therefore 256. This is an example(for simplicity is made for max 8 abilities) of how
 * this works. 
 * 00000001 Ability A - number representation 1
 * 00000010 Ability B - number representation 2
 * 00000100 Ability C - number representation 4
 * 00001000 Ability D - number representation 8
 * 00010000 Ability E - number representation 16
 * etc ... 
 * To grant abilities B and C we would need a bitfield of 00000110 which is represented by number 6
 * in other words the sum od ability B and C. The same concept works for revoking abilities and 
 * checking if someone has multiple abilities.
 * By default abilities are set to 00000000 which means there are no abilities.  
 */
contract Abilitable
{
  using SafeMath for uint;

  /**
   * @dev Error constants.
   */
  string constant NOT_AUTHORIZED = "017001";
  string constant ONE_ZERO_ABILITY_HAS_TO_EXIST = "017002";
  string constant INVALID_INPUT = "017003";

  /**
   * @dev Ability 1 is a reserved ability. It is an ability to grant or revoke abilities. 
   * There can be minimum of 1 address with ability 1.
   * Other abilities are determined by implementing contract.
   */
  uint8 constant ABILITY_TO_MANAGE_ABILITIES = 1;

  /**
   * @dev Maps address to ability ids.
   */
  mapping(address => uint256) public addressToAbility;

  /**
   * @dev Count of zero ability addresses.
   */
  uint256 private zeroAbilityCount;

  /**
   * @dev Emits when an address is granted an ability.
   * @param _target Address to which we are granting abilities.
   * @param _abilities Number representing bitfield of abilities we are granting.
   */
  event GrantAbilities(
    address indexed _target,
    uint256 indexed _abilities
  );

  /**
   * @dev Emits when an address gets an ability revoked.
   * @param _target Address of which we are revoking an ability.
   * @param _abilities Number representing bitfield of abilities we are revoking.
   */
  event RevokeAbilities(
    address indexed _target,
    uint256 indexed _abilities
  );

  /**
   * @dev Guarantees that msg.sender has certain abilities.
   */
  modifier hasAbilities(
    uint256 _abilities
  ) 
  {
    require(
      _abilities > 0 && (addressToAbility[msg.sender] & _abilities) == _abilities,
      NOT_AUTHORIZED
    );
    _;
  }

  /**
   * @dev Contract constructor.
   * Sets ABILITY_TO_MANAGE_ABILITIES ability to the sender account.
   */
  constructor()
    public
  {
    addressToAbility[msg.sender] = ABILITY_TO_MANAGE_ABILITIES;
    zeroAbilityCount = 1;
    emit GrantAbilities(msg.sender, ABILITY_TO_MANAGE_ABILITIES);
  }

  /**
   * @dev Grants specific abilities to specified address.
   * @param _target Address to grant abilities to.
   * @param _abilities Number representing bitfield of abilities we are granting.
   */
  function grantAbilities(
    address _target,
    uint256 _abilities
  )
    external
    hasAbilities(ABILITY_TO_MANAGE_ABILITIES)
  {
    addressToAbility[_target] |= _abilities;

    if((_abilities & 1) == 1)
    {
      zeroAbilityCount = zeroAbilityCount.add(1);
    }
    emit GrantAbilities(_target, _abilities);
  }

  /**
   * @dev Assigns specific abilities to specified address.
   * @param _target Address of which we revoke abilites.
   * @param _abilities Number representing bitfield of abilities we are revoking.
   */
  function revokeAbilities(
    address _target,
    uint256 _abilities
  )
    external
    hasAbilities(ABILITY_TO_MANAGE_ABILITIES)
  {
    addressToAbility[_target] &= ~_abilities;
    if((_abilities & 1) == 1)
    {
      require(zeroAbilityCount > 1, ONE_ZERO_ABILITY_HAS_TO_EXIST);
      zeroAbilityCount--;
    }
    emit RevokeAbilities(_target, _abilities);
  }

  /**
   * @dev Check if an address has a specific ability. Throws if checking for 0.
   * @param _target Address for which we want to check if it has a specific abilities.
   * @param _abilities Number representing bitfield of abilities we are checking.
   */
  function isAble(
    address _target,
    uint256 _abilities
  )
    external
    view
    returns (bool)
  {
    require(_abilities > 0, INVALID_INPUT);
    return (addressToAbility[_target] & _abilities) == _abilities;
  }
  
}
