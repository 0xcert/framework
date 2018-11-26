const { TokenMock } = require('@0xcert/ethereum-erc20-contracts/build/token-mock');
const { NFTokenEnumerableMock } = require('@0xcert/ethereum-erc721-contracts/build/nf-token-enumerable-mock');
const { NFTokenMetadataMock } = require('@0xcert/ethereum-erc721-contracts/build/nf-token-metadata-mock');
const { NFTokenMock } = require('@0xcert/ethereum-erc721-contracts/build/nf-token-mock');
const { BurnableXcertMock } = require('@0xcert/ethereum-xcert-contracts/build/burnable-xcert-mock');
const { MutableXcertMock } = require('@0xcert/ethereum-xcert-contracts/build/mutable-xcert-mock');
const { PausableXcertMock } = require('@0xcert/ethereum-xcert-contracts/build/pausable-xcert-mock');
const { RevokableXcertMock } = require('@0xcert/ethereum-xcert-contracts/build/revokable-xcert-mock');
const { XcertMock } = require('@0xcert/ethereum-xcert-contracts/build/xcert-mock');
const { XcertMintProxy } = require('@0xcert/ethereum-proxy-contracts/build/xcert-mint-proxy');
const { TokenTransferProxy } = require('@0xcert/ethereum-proxy-contracts/build/token-transfer-proxy');
const { NFTokenTransferProxy } = require('@0xcert/ethereum-proxy-contracts/build/nftoken-transfer-proxy');
const { NFTokenSafeTransferProxy } = require('@0xcert/ethereum-proxy-contracts/build/nftoken-safe-transfer-proxy');
const { Exchange } = require('@0xcert/web3-exchange-contracts/build/exchange');

/**
 * ERC20 contract data.
 */
export const erc20 = {
  abi: TokenMock.abi,
  bytecode: TokenMock.evm.bytecode.object,
};

/**
 * Enumerable ERC721 contract data.
 */
export const erc721Enumerable = {
  abi: NFTokenEnumerableMock.abi,
  bytecode: NFTokenEnumerableMock.evm.bytecode.object,
};

/**
 * ERC721 metadata contract data.
 */
export const erc721Metadata = {
  abi: NFTokenMetadataMock.abi,
  bytecode: NFTokenMetadataMock.evm.bytecode.object,
};

/**
 * ERC721 contract data.
 */
export const erc721 = {
  abi: NFTokenMock.abi,
  bytecode: NFTokenMock.evm.bytecode.object,
};

/**
 * Burnable Xcert contract data.
 */
export const xcertBurnable = {
  abi: BurnableXcertMock.abi,
  bytecode: BurnableXcertMock.evm.bytecode.object,
};

/**
 * Mutable Xcert contract data.
 */
export const xcertMutable = {
  abi: MutableXcertMock.abi,
  bytecode: MutableXcertMock.evm.bytecode.object,
};

/**
 * Pausable Xcert contract data.
 */
export const xcertPausable = {
  abi: PausableXcertMock.abi,
  bytecode: PausableXcertMock.evm.bytecode.object,
};

/**
 * Revokable Xcert contract data.
 */
export const xcertRevokable = {
  abi: RevokableXcertMock.abi,
  bytecode: RevokableXcertMock.evm.bytecode.object,
};

/**
 * Xcert contract data.
 */
export const xcert = {
  abi: XcertMock.abi,
  bytecode: XcertMock.evm.bytecode.object,
};

/**
 * Xcert mint proxy contract data.
 */
export const xcertMintProxy = {
  abi: XcertMintProxy.abi,
  bytecode: XcertMintProxy.evm.bytecode.object,
};

/**
 * Token transfer proxy data.
 */
export const tokenTransferProxy = {
  abi: TokenTransferProxy.abi,
  bytecode: TokenTransferProxy.evm.bytecode.object,
};

/**
 * Non-fungible token transfer proxy data.
 */
export const nftokenTransferProxy = {
  abi: NFTokenTransferProxy.abi,
  bytecode: NFTokenTransferProxy.evm.bytecode.object,
};

/**
 * Non-fungible token safe transfer proxy data.
 */
export const nftokenSafeTransferProxy = {
  abi: NFTokenSafeTransferProxy.abi,
  bytecode: NFTokenSafeTransferProxy.evm.bytecode.object,
};

/**
 * Decentralized exchange contract data.
 */
export const exchange = {
  abi: Exchange.abi,
  bytecode: Exchange.evm.bytecode.object,
};
