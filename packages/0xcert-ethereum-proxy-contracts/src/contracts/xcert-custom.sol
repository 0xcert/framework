pragma solidity 0.6.1;
pragma experimental ABIEncoderV2;

import "@0xcert/ethereum-xcert-contracts/src/contracts/xcert.sol";

/**
 * @dev This is an implementation of the Xcert smart contract.
 */
contract XcertCustom is XcertToken {

  /**
   * @dev Constant presenting all and none currently available Xcert abilities.
   */
  uint8 constant ABILITY_NONE = 0;
  uint16 constant ABILITY_ALL = 2047; // Sum of all available abilitites.

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
   * @param _addresses Array of addresses which need to be in following order: owner,
   * xcertCreateProxy, xcertUpdateProxy, abilitableManageProxy, nftSafeTransferProxy,
   * xcertBurnProxy.
   */
  constructor(
    string memory _name,
    string memory _symbol,
    string memory _uriPrefix,
    string memory _uriPostfix,
    bytes32 _schemaId,
    bytes4[] memory _capabilities,
    address[6] memory _addresses
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
    addressToAbility[_addresses[1]] = ABILITY_CREATE_ASSET; /// Gives createProxy ability to create
    /// a new asset.
    addressToAbility[_addresses[2]] = ABILITY_UPDATE_ASSET_IMPRINT; /// Gives updateProxy ability to
    /// update an asset.
    addressToAbility[_addresses[3]] = SUPER_ABILITY; /// Gives manage abilitable proxy ability to
    /// manage abilities.
    addressToAbility[msg.sender] = ABILITY_NONE;
    addressToAbility[_addresses[0]] = ABILITY_ALL; /// Gives owner all abilities.
    ownerToOperators[_addresses[0]][_addresses[4]] = true; /// Sets nft safe transfer proxy as an
    /// operator.
    ownerToOperators[_addresses[0]][_addresses[5]] = true; /// Sets burtn proxy as an operator.
  }

}
