pragma solidity ^0.5.1;

import "./xcert.sol";

/**
 * @dev Xcert implementation where token imprint can be updated.
 */
contract MutableXcert is Xcert {

  /**
   * @dev List of abilities:
   * 4 - Ability to change xcert imprint.
   */
  uint8 constant ABILITY_TO_CHANGE_PROOF = 4;

  /**
   * @dev Error constants.
   */
  string constant NOT_VALID_XCERT = "010001";

  /**
   * @dev Emits when imprint of a token is changed.
   * @param _tokenId Id of the Xcert.
   * @param _imprint Cryptographic asset imprint.
   */
  event TokenImprintUpdate(
    uint256 indexed _tokenId,
    bytes32 _imprint
  );

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftSchemaId, nftName and
   * nftSymbol.
   */
  constructor()
    public
  {
    supportedInterfaces[0xbda0e852] = true; // MutableXcert
  }

  /**
   * @dev Updates Xcert imprint.
   * @param _tokenId Id of the Xcert.
   * @param _imprint New imprint.
   */
  function updateTokenImprint(
    uint256 _tokenId,
    bytes32 _imprint
  )
    external
    hasAbility(ABILITY_TO_CHANGE_PROOF)
  {
    require(idToOwner[_tokenId] != address(0), NOT_VALID_XCERT);
    idToImprint[_tokenId] = _imprint;
    emit TokenImprintUpdate(_tokenId, _imprint);
  }
}