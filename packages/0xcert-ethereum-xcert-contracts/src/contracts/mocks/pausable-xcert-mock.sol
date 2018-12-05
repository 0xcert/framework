pragma solidity ^0.5.1;

import "../pausable-xcert.sol";

/**
 * @dev This is an example implementation of the pausable Xcert smart contract.
 */
contract PausableXcertMock is PausableXcert {

   /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFT.
   * @param _uriBase Base of uri for token metadata uris.
   * @param _schemaId A bytes32 of keccak256 of json schema representing 0xcert protocol
   * convention.
   */
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriBase,
    bytes32 _schemaId
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
    uriBase = _uriBase;
    nftSchemaId = _schemaId;
    isPaused = false; // set the default pause state
  }
}
