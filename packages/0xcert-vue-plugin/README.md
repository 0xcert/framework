<img src="https://github.com/0xcert/framework/raw/master/assets/cover-sub.png" />

> Implementation of VueJS plug-in.

Create a new file `./plugins/0xcert.js` with the code below.

```ts
import Vue from 'vue'
import { Vue0xcert } from '@0xcert/vue-plugin'
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider'
import { Cert } from '@0xcert/cert'
import { AssetLedger } from '@0xcert/ethereum-asset-ledger'
import { ValueLedger } from '@0xcert/ethereum-value-ledger'
import { Gateway } from '@0xcert/ethereum-gateway'

Vue.use(Vue0xcert, {
  provider: new MetamaskProvider({
    actionsGatewayId: '0xf382cfa46f01d9b401d62432ad3797ee190cc97f',
  }),
  modules: [
    { name: 'Cert', object: Cert },
    { name: 'AssetLedger', object: AssetLedger },
    { name: 'ValueLedger', object: ValueLedger },
    { name: 'Gateway', object: Gateway },
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

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).
