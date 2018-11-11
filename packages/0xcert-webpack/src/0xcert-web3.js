window.zxc = window.zxc || {};
window.zxc.web3 = window.zxc.web3 || {};

window.zxc.web3 = {
  ...require('@0xcert/web3-asset-ledger').default,
  ...require('@0xcert/web3-context').default,
  ...require('@0xcert/web3-order-exchange').default,
  ...require('@0xcert/web3-value-ledger').default,
};
