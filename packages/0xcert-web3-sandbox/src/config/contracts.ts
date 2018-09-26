const { Exchange } = require('@0xcert/web3-dex/build/exchange');
const { Minter } = require('@0xcert/web3-dxm/build/Minter');
const { XcertMintProxy } = require('@0xcert/web3-proxy/build/xcert-mint-proxy');
const { TokenTransferProxy } = require('@0xcert/web3-proxy/build/token-transfer-proxy');
const { NFTokenTransferProxy } = require('@0xcert/web3-proxy/build/nftoken-transfer-proxy');

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
 * Decentralized exchange contract data.
 */
export const exchange = {
  abi: Exchange.abi,
  bytecode: Exchange.evm.bytecode.object,
};

/**
 * Decentralized minter contract data.
 */
export const minter = {
  abi: Minter.abi,
  bytecode: Minter.evm.bytecode.object,
};
