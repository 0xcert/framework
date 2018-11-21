window.$0xcert = window.$0xcert || {};
window.$0xcert.web3 = window.$0xcert.web3 || {};

window.$0xcert.web3 = {
  ...require('@0xcert/web3-asset-ledger'),
  ...require('@0xcert/web3-context'),
  ...require('@0xcert/web3-order-exchange'),
  ...require('@0xcert/web3-value-ledger'),
};
