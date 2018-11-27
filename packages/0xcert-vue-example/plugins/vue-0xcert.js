import Vue from 'vue'
import VueMetamask from './modules/vue-metamask'

Vue.use(VueMetamask)



      // const client = new EthereumPlugin({
      //   provider: new MetamaskProvider(),
      //   modules: [
      //     require('@0xcert/ethereum-asset-ledger'),
      //     require('@0xcert/ethereum-value-ledger'),
      //     require('@0xcert/ethereum-order-gateway'),
      //   ],
      // })

      // const ledger = this.$0xcert.getAssetLedger() // please include `@0xcert/ethereum-asset-ledger` module
      // ledger.on(ProviderEvent.MINT, () => {})

      