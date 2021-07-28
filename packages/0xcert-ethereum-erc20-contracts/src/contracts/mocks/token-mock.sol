// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "../token.sol";

/**
 * @dev This is an example contract implementation of Token.
 */
contract TokenMock is
  Token
{
  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint256 _supply
  )
  {
    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
    tokenTotalSupply = _supply;
    balances[msg.sender] = tokenTotalSupply;
    emit Transfer(address(0), msg.sender, tokenTotalSupply);
  }
}
