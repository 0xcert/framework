pragma solidity 0.5.11;

import "../../contracts/math/safe-math.sol";

contract SafeMathTestMock {
  uint256 public result;

  function multiply(
    uint256 _a,
    uint256 _b
  )
    public
  {
    result = SafeMath.mul(_a, _b);
  }

  function subtract(
    uint256 _a,
    uint256 _b
  )
    public
  {
    result = SafeMath.sub(_a, _b);
  }

  function add(
    uint256 _a,
    uint256 _b
  )
    public
  {
    result = SafeMath.add(_a, _b);
  }

  function div(
    uint256 _dividend,
    uint256 _divisor
  )
    public
  {
    result = SafeMath.div(_dividend, _divisor);
  }

  function mod(
    uint256 _dividend,
    uint256 _divisor
  )
    public
  {
    result = SafeMath.mod(_dividend, _divisor);
  }

}
