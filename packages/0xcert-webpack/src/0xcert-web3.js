window.zxc = window.zxc || {};
window.zxc.web3 = window.zxc.web3 || {};

window.zxc.web3 = {
  ...require('@0xcert/web3-asset-ledger'),
  ...require('@0xcert/web3-context'),
  ...require('@0xcert/web3-order-exchange'),
  ...require('@0xcert/web3-value-ledger'),
};
