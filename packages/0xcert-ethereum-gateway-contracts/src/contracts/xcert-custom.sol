pragma solidity 0.5.6;

import "@0xcert/ethereum-xcert-contracts/src/contracts/xcert.sol";

/**
 * @dev This is an implementation of the Xcert smart contract.
 */
contract XcertCustom is XcertToken {

  /**
   * @dev Contract constructor.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFT.
   * @param _uriPrefix Prefix of URI for token metadata URIs.
   * @param _uriPostfix Postfix of URI for token metadata URIs.
   * @param _schemaId A bytes32 of keccak256 of json schema representing 0xcert Protocol
   * convention.
   * @param _capabilities Array of bytes4 representing supported interfaces which activate the
   * corresponding capabilities.
   * @param _owner Owner of the contract. This address will get all available permissions(abilities).
   * @param _assetCreateProxy Address of asset create proxy.
   */
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriPrefix,
    string memory _uriPostfix,
    bytes32 _schemaId,
    bytes4[] memory _capabilities,
    address _owner,
    address _assetCreateProxy
  )
    public
  {
    nftName = _name;
    nftSymbol = _symbol;
    uriPrefix = _uriPrefix;
    uriPostfix = _uriPostfix;
    nftSchemaId = _schemaId;
    for(uint256 i = 0; i < _capabilities.length; i++)
    {
      supportedInterfaces[_capabilities[i]] = true;
    }
    addressToAbility[_assetCreateProxy] = ABILITY_CREATE_ASSET; // Gives createProxy ability to create a new asset.
    addressToAbility[msg.sender] = 0; // Remove super ability from creator.
    addressToAbility[_owner] = 255; // Assigns all available abilities to the new owner.
  }

}
