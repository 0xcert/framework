// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;
import "./token-custom.sol";

/**
 * @title TokenDeployProxy - Deploys a new token on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract TokenDeployProxy
{
  /**
   * @dev Deploys a new Token.
   * @param _name Token name.
   * @param _symbol Token symbol.
   * @param _supply Total supply of tokens.
   * @param _decimals Number of decimals.
   * @param _owner Token owner.
   */
  function deploy(
    string memory _name,
    string memory _symbol,
    uint256 _supply,
    uint8 _decimals,
    address _owner
  )
    public
    returns (address token)
  {
    token = address(
      new TokenCustom(
        _name, _symbol, _supply, _decimals, _owner
      )
    );
  }
}
