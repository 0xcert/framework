pragma solidity ^0.5.1;

import "./xcert.sol";

/**
 * @dev Xcert implementation where tokens can be revoked by contract owner or authorized address.
 */
contract RevokableXcert is Xcert {

  /**
   * @dev List of abilities:
   * 2 - Ability to revoke xcerts.
   */
  uint8 constant ABILITY_TO_REVOKE_XCERTS = 2;

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftSchemaId, nftName and
   * nftSymbol.
   */
  constructor()
    public
  {
    supportedInterfaces[0x20c5429b] = true; // RevokableXcert
  }

  /**
   * @dev Revokes a specified Xcert. Reverts if not called from contract owner or authorized 
   * address.
   * @param _tokenId Id of the Xcert we want to burn.
   */
  function revoke(
    uint256 _tokenId
  )
    external
    hasAbility(ABILITY_TO_REVOKE_XCERTS)
  {
    super._burn(_tokenId);
    delete idToImprint[_tokenId];
  }
}