const path = require('path');

module.exports = {
  entry: {
    '0xcert-main': `./src/0xcert-main.js`,
    '0xcert-web3': `./src/0xcert-web3.js`,
  },
  output: {
    filename: `[name].min.js`,
  },
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
};
