import Vue from 'vue'
import { Vue0xcert } from '@0xcert/vue-plugin'
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider'
import { Cert } from '@0xcert/cert'
import { AssetLedger } from '@0xcert/ethereum-asset-ledger'
import { ValueLedger } from '@0xcert/ethereum-value-ledger'
import { OrderGateway } from '@0xcert/ethereum-order-gateway'

Vue.use(Vue0xcert, {
  provider: new MetamaskProvider(),
  modules: [
    { name: 'Cert', object: Cert },
    { name: 'AssetLedger', object: AssetLedger },
    { name: 'ValueLedger', object: ValueLedger },
    { name: 'OrderGateway', object: OrderGateway },
  ],
})
