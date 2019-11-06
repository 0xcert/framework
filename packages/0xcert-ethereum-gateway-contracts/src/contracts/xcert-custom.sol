pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-xcert-contracts/src/contracts/xcert.sol";

/**
 * @dev This is an implementation of the Xcert smart contract.
 */
contract XcertCustom is XcertToken {

  /**
   * Contant presenting all and none currently available Xcert abilities.
   */
  uint8 constant ABILITY_NONE = 0;
  uint16 constant ABILITY_ALL = 2047;

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
   * @param _proxies Array of proxy addresses which need to be in following order: xcertCreateProxy,
   * xcertUpdateProxy, abilitableManageProxy, nftSafeTransferProxy, xcertBurnProxy.
   */
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriPrefix,
    string memory _uriPostfix,
    bytes32 _schemaId,
    bytes4[] memory _capabilities,
    address _owner,
    address[5] memory _proxies
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
    addressToAbility[_proxies[0]] = ABILITY_CREATE_ASSET; // Gives createProxy ability to create a new asset.
    addressToAbility[_proxies[1]] = ABILITY_UPDATE_ASSET_IMPRINT; // Gives updateProxy ability to update an asset.
    addressToAbility[_proxies[2]] = SUPER_ABILITY; // Gives manage abilitable proxy ability to manage abilities.
    addressToAbility[msg.sender] = ABILITY_NONE;
    addressToAbility[_owner] = ABILITY_ALL;
    ownerToOperators[_owner][_proxies[3]] = true;
    ownerToOperators[_owner][_proxies[4]] = true;
  }

}
