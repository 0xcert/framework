pragma solidity 0.5.11;

import "./xcert-custom.sol";
import "@0xcert/ethereum-utils-contracts/src/contracts/permission/abilitable.sol";

/**
 * @title XcertDeployProxy - Deploys a new token on behalf of contracts that have been approved via
 * decentralized governance.
 */
contract XcertDeployProxy is
  Abilitable
{

  /**
   * @dev List of abilities:
   * 16 - Ability to execute create.
   */
  uint8 constant ABILITY_TO_EXECUTE = 16;

  /**
   * @dev Deploys a new Xcert.
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
  function deploy(
    string memory _name,
    string memory _symbol,
    string memory _uriPrefix,
    string memory _uriPostfix,
    bytes32 _schemaId,
    bytes4[] memory _capabilities,
    address[6] memory _addresses
  )
    public
    hasAbilities(ABILITY_TO_EXECUTE)
    returns (address xcert)
  {
    xcert = address(
      new XcertCustom(
        _name, _symbol, _uriPrefix, _uriPostfix, _schemaId, _capabilities, _addresses
      )
    );
  }
}
