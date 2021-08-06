// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

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
 * To grant abilities B and C, we would need a bitfield of 00000110 which is represented by number
 * 6, in other words, the sum of abilities B and C. The same concept works for revoking abilities
 * and checking if someone has multiple abilities.
 */
contract Abilitable
{
  /**
   * @dev Error constants.
   */
  string constant NOT_AUTHORIZED = "017001";
  string constant INVALID_INPUT = "017002";

  /**
   * @dev Ability 1 (00000001) is a reserved ability called super ability. It is an
   * ability to grant or revoke abilities of other accounts.
   */
  uint8 constant SUPER_ABILITY = 1;

  /**
   * @dev Ability 2 (00000010) is a reserved ability called allow manage ability. It is a specific
   * ability bounded to atomic orders. The order maker has to have this ability to to grant or
   * revoke abilities of other accounts trough abilitable gateway.
   */
  uint8 constant ALLOW_SUPER_ABILITY = 2;

  /**
   * @dev Ability 4 (00000100) is a reserved ability for possible future abilitable extensions.
   */
  uint8 constant EMPTY_SLOT_1 = 4;

  /**
   * @dev Ability 8 (00001000) is a reserved ability for possible future abilitable extensions.
   */
  uint8 constant EMPTY_SLOT_2 = 8;

  /**
   * @dev All basic abilities. SUPER_ABILITY + ALLOW_MANAGE_ABILITY + EMPTY_SLOT_1 + EMPTY_SLOT_2.
   */
  uint8 constant ALL_DEFAULT_ABILITIES = 15;

  /**
   * @dev Maps address to ability ids.
   */
  mapping(address => uint256) public addressToAbility;

  /**
   * @dev Emits when address abilities are changed.
   * @param _target Address of which the abilities where changed.
   * @param _abilities New abilitites.
   */
  event SetAbilities(
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
    require(_abilities > 0, INVALID_INPUT);
    require(
      addressToAbility[msg.sender] & _abilities == _abilities,
      NOT_AUTHORIZED
    );
    _;
  }

  /**
   * @dev Contract constructor.
   * Sets SUPER_ABILITY ability to the sender account.
   */
  constructor()
  {
    addressToAbility[msg.sender] = ALL_DEFAULT_ABILITIES;
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
    hasAbilities(SUPER_ABILITY)
  {
    addressToAbility[_target] |= _abilities;
    emit SetAbilities(_target, addressToAbility[_target]);
  }

  /**
   * @dev Unassigns specific abilities from specified address.
   * @param _target Address of which we revoke abilites.
   * @param _abilities Number representing bitfield of abilities we are revoking.
   */
  function revokeAbilities(
    address _target,
    uint256 _abilities
  )
    external
    hasAbilities(SUPER_ABILITY)
  {
    addressToAbility[_target] &= ~_abilities;
    emit SetAbilities(_target, addressToAbility[_target]);
  }

  /**
   * @dev Sets specific abilities to specified address.
   * @param _target Address to which we are setting abilitites.
   * @param _abilities Number representing bitfield of abilities we are setting.
   */
  function setAbilities(
    address _target,
    uint256 _abilities
  )
    external
    hasAbilities(SUPER_ABILITY)
  {
    addressToAbility[_target] = _abilities;
    emit SetAbilities(_target, _abilities);
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
