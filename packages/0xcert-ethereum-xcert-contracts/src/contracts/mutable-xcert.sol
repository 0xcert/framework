pragma solidity ^0.4.25;

import "./xcert.sol";

/**
 * @dev Xcert implementation where token proof can be updated.
 */
contract MutableXcert is Xcert {

  /**
   * @dev List of abilities:
   * 4 - Ability to change xcert proof.
   */
  uint8 constant ABILITY_TO_CHANGE_PROOF = 4;

  /**
   * @dev Error constants.
   */
  string constant NOT_VALID_XCERT = "010001";

  /**
   * @dev Emits when proof of a token is changed.
   * @param _tokenId Id of the Xcert.
   * @param _proof Cryptographic asset imprint.
   */
  event TokenProofUpdate(
    uint256 indexed _tokenId,
    bytes32 _proof
  );

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftSchemaId, nftName and
   * nftSymbol.
   */
  constructor()
    public
  {
    supportedInterfaces[0x5e2161af] = true; // MutableXcert
  }

  /**
   * @dev Updates Xcert proof.
   * @param _tokenId Id of the Xcert.
   * @param _proof New proof.
   */
  function updateTokenProof(
    uint256 _tokenId,
    bytes32 _proof
  )
    external
    hasAbility(ABILITY_TO_CHANGE_PROOF)
  {
    require(idToOwner[_tokenId] != address(0), NOT_VALID_XCERT);
    idToProof[_tokenId] = _proof;
    emit TokenProofUpdate(_tokenId, _proof);
  }
}