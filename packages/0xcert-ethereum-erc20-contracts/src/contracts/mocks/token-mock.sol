pragma solidity ^0.4.25;

import "../token.sol";

/**
 * @dev This is an example contract implementation of Token.
 */
contract TokenMock is Token {

  constructor(
    string _name,
    string _symbol,
    uint8 _decimals,
    uint256 _supply
  )
    public
  {
    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
    tokenTotalSupply = _supply;
    balances[msg.sender] = tokenTotalSupply;
  }
}
