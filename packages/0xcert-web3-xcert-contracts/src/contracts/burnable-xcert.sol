pragma solidity ^0.4.25;

import "./xcert.sol";

/**
 * @dev Xcert implementation where tokens can be destroyed by the owner or operator.
 */
contract BurnableXcert is Xcert {
  
  /**
   * @dev Error constants.
   */
  string constant NOT_OWNER_OR_OPERATOR = "008001";

  /**
   * @dev Contract constructor.
   * @notice When implementing this contract don't forget to set nftConventionId, nftName and
   * nftSymbol.
   */
  constructor()
    public
  {
    supportedInterfaces[0x42966c68] = true; // BurnableXcert
  }

  /**
   * @dev Burns a specified Xcert. Reverts if not called from xcert owner or operator.
   * @param _tokenId Id of the Xcert we want to burn.
   */
  function burn(
    uint256 _tokenId
  )
    external
  {
    address tokenOwner = idToOwner[_tokenId];
    super._burn(_tokenId);
    require(
      tokenOwner == msg.sender || ownerToOperators[tokenOwner][msg.sender],
      NOT_OWNER_OR_OPERATOR
    );
    delete idToProof[_tokenId];
  }
}