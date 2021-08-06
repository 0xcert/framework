// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "../xcert.sol";

/**
 * @dev This is an example implementation of the Xcert smart contract.
 */
contract XcertMock is XcertToken {

  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFT.
   * @param _uriPrefix Prefix of URI for token metadata URIs.
   * @param _uriPostfix Postfix of URI for token metadata URIs.
   * @param _schemaURIIntegrityDigest A bytes32 of keccak256 of json schema representing 0xcert
   * Protocol convention.
   * @param _capabilities Array of bytes4 representing supported interfaces which activate the
   * corresponding capabilities.
   */
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriPrefix,
    string memory _uriPostfix,
    bytes32 _schemaURIIntegrityDigest,
    bytes4[] memory _capabilities
  )
  {
    nftName = _name;
    nftSymbol = _symbol;
    uriPrefix = _uriPrefix;
    uriPostfix = _uriPostfix;
    schemaURIIntegrityDigest = _schemaURIIntegrityDigest;
    for(uint256 i = 0; i < _capabilities.length; i++)
    {
      supportedInterfaces[_capabilities[i]] = true;
    }
    addressToAbility[msg.sender] = 2047; // Assigns all available abilities to creator.
  }

}
