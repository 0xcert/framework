const path = require('path');

module.exports = {
  entry: {
    '0xcert-client': `./src/0xcert-client.js`,
    // '0xcert-ethereum-generic-provider': `./src/0xcert-ethereum-generic-provider.js`,
  },
  output: {
    filename: `[name].min.js`,
    path: path.join(__dirname, '..', '..', 'dist'),
  },
  // optimization: {
  //   minimize: false,
  // },
  externals: {
    'window': {},
    'crypto': {}, // node only
    'web3': {},
  },
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
};
