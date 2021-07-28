// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;
/**
 * @title ERC-2477 Non-Fungible Token Metadata Integrity Standard
 * @dev See https://eips.ethereum.org/EIPS/eip-2477
 * @dev The ERC-165 identifier for this interface is 0x#######. //TODO: FIX THIS
 */
interface ERC2477 /* is ERC165 */ {
  /**
   * @notice Get the cryptographic hash of the specified tokenID's metadata
   * @param tokenId Identifier for a specific token
   * @return digest Bytes returned from the hash algorithm
   * @return hashAlgorithm The name of the cryptographic hash algorithm
   */
  function tokenURIIntegrity(uint256 tokenId) external view returns(bytes memory digest, string memory hashAlgorithm);

  /**
   * @notice Get the cryptographic hash for the specified tokenID's metadata schema
   * @param tokenId Id of the Xcert.
   * @return digest Bytes returned from the hash algorithm or "" if there is no schema
   * @return hashAlgorithm The name of the cryptographic hash algorithm or "" if there is no schema
   */
  function tokenURISchemaIntegrity(uint256 tokenId) external view returns(bytes memory digest, string memory hashAlgorithm);
}