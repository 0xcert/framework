# VueJS Plugin

Create a new file `./plugins/0xcert.js` with the code below.

```ts
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
```

Register the plugin inside the `nuxt.config.js` file.

```ts
export default {
  plugins: [
    { src: '~/plugins/0xcert', ssr: false },
  ],
}
```

The plugin gives you access the 0xcert VueJS client.

```ts
const client = this.$0xcert; // 0xcert client
const provider = this.$0xcert.provider; // current provider
```
