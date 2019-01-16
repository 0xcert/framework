pragma solidity 0.5.1;

import "../../contracts/permission/abilitable.sol";

contract AbilitableTestMock is
  Abilitable
{
  function ability1()
    external
    view
    hasAbilities(1)
    returns (string memory)
  {
    return "1";
  }

  function ability2()
    external
    view
    hasAbilities(2)
    returns (string memory)
  {
    return "2";
  }
}
