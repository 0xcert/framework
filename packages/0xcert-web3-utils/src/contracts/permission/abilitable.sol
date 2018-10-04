pragma solidity ^0.4.25;
import "../math/safe-math.sol";

/**
 * @dev Contract for setting abilities.
 */
contract Abilitable {

  using SafeMath for uint;

  /**
   * @dev Error constants.
   */
  string constant NOT_AUTHORIZED = "017001";
  string constant ONE_ZERO_ABILITY_HAS_TO_EXIST = "017002";

  /**
   * @dev Maps address to ability id.
   * Id 0 is a reserved ability. It is an ability to assign or revoke abilities. 
   * There can be minimum of 1 address with 0 id ability.
   * Other ability id are determined by implementing contract.
   */
  mapping(address => mapping(uint8 => bool)) private addressToAbility;

  /**
   * @dev Count of zero ability addresses.
   */
  uint256 private zeroAbilityCount;

  /**
   * @dev Emits when an address is assigned an ability.
   * @param _target Address to which we are assigning ability.
   * @param _ability Id of ability.
   */
  event AssignAbility(
    address indexed _target,
    uint8 indexed _ability
  );

  /**
   * @dev Emits when an address gets an ability revoked.
   * @param _target Address of which we are revoking an ability.
   * @param _ability Id of ability.
   */
  event RevokeAbility(
    address indexed _target,
    uint8 indexed _ability
  );

  /**
   * @dev Guarantees that msg.sender has a certain ability.
   */
  modifier hasAbility(
    uint8 _ability
  ) 
  {
    require(addressToAbility[msg.sender][_ability], NOT_AUTHORIZED);
    _;
  }

  /**
   * @dev Contract constructor.
   * Sets zero ability to the sender account.
   */
  constructor()
    public
  {
    addressToAbility[msg.sender][0] = true;
    zeroAbilityCount = 1;
    emit AssignAbility(msg.sender, 0);
  }

  /**
   * @dev Assigns specific abilities to specified address.
   * @param _target Address to assign abilities to.
   * @param _abilities List of ability IDs.
   */
  function assignAbilities(
    address _target,
    uint8[] _abilities
  )
    external
    hasAbility(0)
  {
    for(uint8 i; i<_abilities.length; i++)
    {
      if(_abilities[i] == 0)
      {
        zeroAbilityCount = zeroAbilityCount.add(1);
      }

      addressToAbility[_target][_abilities[i]] = true;
      emit AssignAbility(_target, _abilities[i]);
    }
  }

  /**
   * @dev Assigns specific abilities to specified address.
   * @param _target Address of which we revoke abilites.
   * @param _abilities List of ability IDs.
   */
  function revokeAbilities(
    address _target,
    uint8[] _abilities
  )
    external
    hasAbility(0)
  {
    for(uint8 i; i<_abilities.length; i++)
    {
      if(_abilities[i] == 0 )
      {
        require(zeroAbilityCount > 1, ONE_ZERO_ABILITY_HAS_TO_EXIST);
        zeroAbilityCount--;
      }

      addressToAbility[_target][_abilities[i]] = false;
      emit RevokeAbility(_target, _abilities[i]);
    }
  }

  /**
   * @dev Check if an address has a specific ability.
   * @param _target Address for which we want to check if it has a specific ability.
   * @param _ability Id of ability.
   */
  function isAble(
    address _target,
    uint8 _ability
  )
    external
    view
    returns (bool)
  {
    return addressToAbility[_target][_ability];
  }
}