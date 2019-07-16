window.$0xcert = window.$0xcert || {};

Object.assign(
  window.$0xcert,
  require('@0xcert/cert'),
  require('@0xcert/wanchain-asset-ledger'),
  require('@0xcert/wanchain-gateway'),
  require('@0xcert/wanchain-value-ledger'),
);
