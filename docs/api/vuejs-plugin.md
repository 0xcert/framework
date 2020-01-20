# Vue.js Plugin

Create a new file `./plugins/0xcert.js` with the code below.

```ts
import Vue from 'vue'
import { Vue0xcert } from '@0xcert/vue-plugin'
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider'
import { Cert } from '@0xcert/cert'
import { AssetLedger } from '@0xcert/ethereum-asset-ledger'
import { ValueLedger } from '@0xcert/ethereum-value-ledger'
import { Gateway } from '@0xcert/ethereum-gateway'

const provider = new MetamaskProvider();
provider.on(ProviderEvent.ACCOUNT_CHANGE, (accountId) => { })
provider.on(ProviderEvent.NETWORK_CHANGE, (networkVersion) => {})

Vue.use(Vue0xcert, {
  provider,
  modules: [
    { name: 'Cert', object: Cert },
    { name: 'AssetLedger', object: AssetLedger },
    { name: 'ValueLedger', object: ValueLedger },
    { name: 'Gateway', object: Gateway },
  ],
})
```
## Nuxt.js implementation

Register the plug-in inside the `nuxt.config.js` file.

```ts
export default {
  plugins: [
    { src: '~/plugins/0xcert', ssr: false },
  ],
}
```

The plug-in gives you access to the [0xcert VueJS client](https://github.com/0xcert/framework/blob/master/packages/0xcert-vue-plugin/src/core/client.ts).

```ts
const client = this.$0xcert; // 0xcert client
const provider = this.$0xcert.provider; // current provider
await this.$0xcert.deployAssetLedger({ ... }); // deploy AssetLedger
await this.$0xcert.deployValueLedger({ ... }); // deploy ValueLedger
this.$0xcert.getAssetLedger(id); // get instance of AssetLedger
this.$0xcert.getValueLedger(id); // get instance of ValueLedger
this.$0xcert.getGateway(id); // get instance of Gateway
this.$0xcert.createCert(schema); // 
```
