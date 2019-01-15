pragma solidity 0.5.1;

/**
 * @dev Xcert burnable interface.
 */
interface XcertBurnable // is Xcert
{

  /**
   * @dev Destroys a specified Xcert. Reverts if not called from xcert owner or operator.
   * @param _tokenId Id of the Xcert we want to destroy.
   */
  function destroy(
    uint256 _tokenId
  )
    external;

}