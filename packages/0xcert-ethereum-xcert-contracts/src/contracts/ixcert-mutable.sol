pragma solidity 0.6.1;

/**
 * @dev Xcert mutable interface.
 */
interface XcertMutable // is Xcert
{

  /**
   * @dev Updates Xcert tokenURIIntegrityDigest.
   * @param _tokenId Id of the Xcert.
   * @param _tokenURIIntegrityDigest New tokenURIIntegrityDigest.
   */
  function updateTokenURIIntegrityDigest(
    uint256 _tokenId,
    bytes32 _tokenURIIntegrityDigest
  )
    external;

}
