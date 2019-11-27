pragma solidity 0.5.11;

import "./token-custom.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

/**
 * @title TokenDeployProxy - Deploys a new token on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract TokenDeployProxy is
  Abilitable
{

  /**
   * @dev List of abilities:
   * 16 - Ability to execute create.
   */
  uint8 constant ABILITY_TO_EXECUTE = 16;

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
    hasAbilities(ABILITY_TO_EXECUTE)
    returns (address token)
  {
    token = address(
      new TokenCustom(
        _name, _symbol, _supply, _decimals, _owner
      )
    );
  }
}
