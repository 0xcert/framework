const path = require('path');

module.exports = {
  entry: {
    '0xcert-client': `./src/0xcert-client.js`,
    '0xcert-web3-connector': `./src/0xcert-web3-connector.js`,
  },
  output: {
    filename: `[name].min.js`,
    path: path.join(__dirname, '..', '..', 'dist'),
  },
  optimization: {
    minimize: false,
  },
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
};
