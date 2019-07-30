window.$0xcert = window.$0xcert || {};

Object.assign(
  window.$0xcert,
  require('@0xcert/cert'),
  require('@0xcert/ethereum-asset-ledger'),
  require('@0xcert/ethereum-gateway'),
  require('@0xcert/ethereum-value-ledger'),
);
