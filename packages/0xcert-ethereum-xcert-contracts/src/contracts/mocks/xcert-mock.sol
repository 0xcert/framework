pragma solidity 0.5.1;

import "../xcert.sol";

/**
 * @dev This is an example implementation of the Xcert smart contract.
 */
contract XcertMock is Xcert {

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
    bytes32 _schemaId,
    bytes4[] memory _capabilities
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
    uriBase = _uriBase;
    nftSchemaId = _schemaId;
    for(uint256 i = 0; i < _capabilities.length; i++)
    {
      supportedInterfaces[_capabilities[i]] = true;
    }
    addressToAbility[msg.sender][1] = true;
    addressToAbility[msg.sender][2] = true;
    addressToAbility[msg.sender][3] = true;
    addressToAbility[msg.sender][4] = true;
    addressToAbility[msg.sender][5] = true;
    addressToAbility[msg.sender][6] = true;
  }
  
}
