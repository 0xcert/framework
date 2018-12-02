const path = require('path');

module.exports = {
  entry: {
    '0xcert-cert': './src/0xcert-cert.js',
    '0xcert-ethereum-asset-ledger': './src/0xcert-ethereum-asset-ledger.js',
    '0xcert-ethereum-http-provider': './src/0xcert-ethereum-http-provider.js',
    '0xcert-ethereum-metamask-provider': './src/0xcert-ethereum-metamask-provider.js',
    '0xcert-ethereum-order-gateway': './src/0xcert-ethereum-order-gateway.js',
    '0xcert-ethereum-value-ledger': './src/0xcert-ethereum-value-ledger.js',
    '0xcert-ethereum-ws-provider': './src/0xcert-ethereum-ws-provider.js',
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
