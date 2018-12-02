pragma solidity ^0.4.25;

import "../mutable-xcert.sol";

/**
 * @dev This is an example implementation of the mutable Xcert smart contract.
 */
contract MutableXcertMock is MutableXcert {

  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFT.
   * @param _uriBase Base of uri for token metadata uris.
   * @param _schemaId A bytes32 of keccak256 of json schema representing 0xcert protocol
   * convention.
   */
  constructor(
    string _name,
    string _symbol,
    string _uriBase,
    bytes32 _schemaId
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
    uriBase = _uriBase;
    nftConventionId = _schemaId;
  }
}
