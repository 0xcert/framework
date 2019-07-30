import Vue from 'vue'
import { Vue0xcert } from '@0xcert/vue-plugin'
import { MetamaskProvider, ProviderEvent } from '@0xcert/ethereum-metamask-provider'
import { Cert } from '@0xcert/cert'
import { AssetLedger } from '@0xcert/ethereum-asset-ledger'
import { ValueLedger } from '@0xcert/ethereum-value-ledger'
import { Gateway } from '@0xcert/ethereum-gateway'

const provider = new MetamaskProvider()
provider.on(ProviderEvent.ACCOUNT_CHANGE, (newAccountId, oldAccountId) => {
  if (oldAccountId) location.reload()
})
provider.on(ProviderEvent.NETWORK_CHANGE, (newNetworkVersion, oldNetworkId) => {
  if (oldNetworkId) location.reload()
})

Vue.use(Vue0xcert, {
  provider,
  modules: [
    { name: 'Cert', object: Cert },
    { name: 'AssetLedger', object: AssetLedger },
    { name: 'ValueLedger', object: ValueLedger },
    { name: 'Gateway', object: Gateway },
  ],
})
