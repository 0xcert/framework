pragma solidity 0.5.3;

import "../../contracts/permission/abilitable.sol";

contract AbilitableTestMock is
  Abilitable
{
  uint8 constant ABILITY_A = 1;
  uint8 constant ABILITY_B = 2;

  function abilityA()
    external
    view
    hasAbilities(ABILITY_A)
    returns (string memory)
  {
    return "A";
  }

  function abilityB()
    external
    view
    hasAbilities(ABILITY_B)
    returns (string memory)
  {
    return "B";
  }

  function abilityX(uint8 _ability)
    external
    view
    hasAbilities(_ability)
    returns (string memory)
  {
    return "X";
  }
}
