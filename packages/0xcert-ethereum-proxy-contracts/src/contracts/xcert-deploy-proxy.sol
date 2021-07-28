// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "./xcert-custom.sol";

/**
 * @title XcertDeployProxy - Deploys a new xcert.
 */
contract XcertDeployProxy
{
  /**
   * @dev Deploys a new Xcert.
   * @param _name A descriptive name for a collection of NFTs.
   * @param _symbol An abbreviated name for NFT.
   * @param _uriPrefix Prefix of URI for token metadata URIs.
   * @param _uriPostfix Postfix of URI for token metadata URIs.
   * @param _schemaURIIntegrityDigest A bytes32 of keccak256 of json schema representing 0xcert
   * Protocol convention.
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
    bytes32 _schemaURIIntegrityDigest,
    bytes4[] memory _capabilities,
    address[6] memory _addresses
  )
    public
    returns (address xcert)
  {
    xcert = address(
      new XcertCustom(
        _name,
        _symbol,
        _uriPrefix,
        _uriPostfix,
        _schemaURIIntegrityDigest,
        _capabilities,
        _addresses
      )
    );
  }
}
