// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "../dapp-token.sol";

/**
 * @dev This is an example contract implementation of DappToken.
 */
contract DappTokenMock is
  DappToken
{
  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    address _barteredToken,
    address _tokenTransferProxy
  )
  {
    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
    barteredToken = ERC20(_barteredToken);
    tokenTransferProxy = _tokenTransferProxy;
  }
}
