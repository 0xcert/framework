pragma solidity ^0.4.25;

import "./xcert.sol";

/**
 * @dev Xcert implementation where token proof can be updated.
 */
contract MutableXcert is Xcert {

  /**
   * @dev Error constants.
   */
  string constant EMPTY_PROOF = "010001";
  string constant NOT_VALID_XCERT = "010002";

  /**
   * @dev Emits when proof of a token is changed.
   * @param _tokenId Id of the Xcert.
   * @param _proof Cryptographic asset imprint.
   */
  event TokenProofUpdate(
    uint256 indexed _tokenId,
    string _proof
  );

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftConventionId, nftName and
   * nftSymbol.
   */
  constructor()
    public
  {
    supportedInterfaces[0x33b641ae] = true; // MutableXcert
  }

  /**
   * @dev Updates Xcert proof.
   * @param _tokenId Id of the Xcert.
   * @param _proof New proof.
   */
  function updateTokenProof(
    uint256 _tokenId,
    string _proof
  )
    external
    isAuthorized()
  {
    require(bytes(_proof).length > 0, EMPTY_PROOF);
    require(idToOwner[_tokenId] != address(0), NOT_VALID_XCERT);
    idToProof[_tokenId] = _proof;
    emit TokenProofUpdate(_tokenId, _proof);
  }
}