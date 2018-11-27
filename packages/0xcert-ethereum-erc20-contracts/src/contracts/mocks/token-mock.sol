pragma solidity ^0.4.25;

import "../token.sol";

/**
 * @dev This is an example contract implementation of Token.
 */
contract TokenMock is Token {

  constructor()
    public
  {
    tokenName = "Mock Token";
    tokenSymbol = "MCK";
    tokenDecimals = 18;
    tokenTotalSupply = 300000000000000000000000000;
    balances[msg.sender] = tokenTotalSupply;
  }
}
