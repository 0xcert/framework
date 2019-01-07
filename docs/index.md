---
pageClass: homepage
---

![0xcert](./assets/hero-image.svg)

Creating unique assets has never been easier.

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

const provider = new MetamaskProvider();

const mutation = await AssetLedger.deploy(provider, {
  name: 'Math Course Certificate',
  symbol: 'MCC',
  uriBase: 'https://0xcert.org/assets/',
  schemaId: '0x0000000000000000000000000000000000000000000000000000000000000000',
  capabilities: [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
  ],
}).then((mutation) => {
    return mutation.complete();
});
```

<a href="/guide/getting-started.html" class="button">Getting started</a>

| Framework | API | Plugins
|-|-|-
| As a JavaScript library, the 0xcert Framework provides tools for building powerful decentralized applications (dapps). [Read more](/guide/introduction.html) | The platform-agnostic API provides the same functions on any distributed system you choose to build on. [Read more](/api/core.html) | A quick access to all 0xcert API methods is enabled through a VueJS plug-in for a faster prototyping of your dapp.  [Read more](/plugins/vuejs.html) |

<ul class="products">
  <li><img src="./assets/logo_0xcert.svg"/></li>
  <li><img src="./assets/logo_validator.svg"/></li>
  <li><img src="./assets/logo_swapmarket.svg"/></li>
  <li><img src="./assets/logo_alliance.svg"/></li>
</ul>