pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

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
    public
  {
    tokenName = _name;
    tokenSymbol = _symbol;
    tokenDecimals = _decimals;
    barteredToken = ERC20(_barteredToken);
    tokenTransferProxy = _tokenTransferProxy;
  }
}
