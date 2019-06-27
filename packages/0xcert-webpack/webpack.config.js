const path = require('path');

module.exports = {
  entry: {
    '0xcert-cert': './src/0xcert-cert.js',
    '0xcert-ethereum-asset-ledger': './src/0xcert-ethereum-asset-ledger.js',
    '0xcert-ethereum-http-provider': './src/0xcert-ethereum-http-provider.js',
    '0xcert-ethereum-metamask-provider': './src/0xcert-ethereum-metamask-provider.js',
    '0xcert-ethereum-order-gateway': './src/0xcert-ethereum-order-gateway.js',
    '0xcert-ethereum-deploy-gateway': './src/0xcert-ethereum-deploy-gateway.js',
    '0xcert-ethereum-value-ledger': './src/0xcert-ethereum-value-ledger.js',
    '0xcert-ethereum-bitski-frontend-provider': './src/0xcert-ethereum-bitski-frontend-provider.js',
    '0xcert-wanchain-asset-ledger': './src/0xcert-wanchain-asset-ledger.js',
    '0xcert-wanchain-http-provider': './src/0xcert-wanchain-http-provider.js',
    '0xcert-wanchain-order-gateway': './src/0xcert-wanchain-order-gateway.js',
    '0xcert-wanchain-deploy-gateway': './src/0xcert-wanchain-deploy-gateway.js',
    '0xcert-wanchain-value-ledger': './src/0xcert-wanchain-value-ledger.js',
    '0xcert-ethereum': './src/0xcert-ethereum.js',
    '0xcert-wanchain': './src/0xcert-wanchain.js',
  },
  output: {
    filename: `[name].min.js`,
    path: path.join(__dirname, '..', '..', 'dist'),
  },
  externals: {
    'window': {},
    'crypto': {}, // node only
    'web3': {},
  },
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
};
