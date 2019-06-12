# Asset management

Each asset always belongs to the structure within a storage called the Asset Ledger. As discussed in one of the previous [sections](/guide/about-assets.html#explaining-the-concept), a ledger is like a folder containing the assets of a specific issuer and related owners. Only users authorized by the ledger's owner are allowed to manage the ledger. Depending on its configuration, authorized accounts can handle the ledger and thus create and manage its assets.

On the Ethereum blockchain, an asset ledger is a smart contract which is complied with the [ERC-721 standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md). The 0xcert Framework follows this standard but also adds some additional functions visible in the [API](/api/core.html) section.

::: card Learn by example
Click [here](https://stackblitz.com/edit/asset-management-example) to check the live example for this section.
:::

## Installation

We recommend you employ the asset ledger module as an NPM package in your application.

```shell
$ npm i --save @0xcert/ethereum-asset-ledger
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that you can directly include in your website. Please refer to the [API](/api/core.html) section to learn more about asset ledger.

## Usage overview

We begin by importing the modules.

```ts
import { AssetLedger, AssetLedgerCapability } from '@0xcert/ethereum-asset-ledger';
```

Now, lets deploy a new asset ledger to the Ethereum blockchain.

```ts
const mutation = await AssetLedger.deploy(provider, {
  name: 'Math Course Certificate',
  symbol: 'MCC',
  uriBase: 'https://0xcert.org/assets/',
  schemaId: '0x3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d', // base asset schemaId
  capabilities: [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
  ],
}).then((mutation) => {
    return mutation.complete();
});

const assetLedgerId = mutation.receiverId;
```

Now that a new asset ledger has been deployed on the network, you can create a new instance of it.

```ts
const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
```

We can now perform `query` and `mutation` requests on this newly deployed asset ledger. Below is an example of a query that retrieves general information about this asset ledger.

```ts
const assetLedgerInfo = await assetLedger.getInfo();
//=> { name: 'Certificate', symbol: 'CERT', uriBase: 'http://domain.com', schemaId: '239423' }
```

This query should return similar information to the one we defined when we deployed the new asset ledger. At the beginning of this section, we explained that the asset ledger as a book or folder of ownership records. The items contained in this book are called `Assets`.

It's time to create a new asset to which we determine its unique ID `100`. In the example below, we can create a new asset and send it to our selected MetaMask account marked with `receiverId`. We use the imprint from the previous [section](/guide/certification.html#usage-overview) where we went through the process of asset certification.

```ts
const mutation = await assetLedger.createAsset({
  id: '100',
  imprint: 'aa431acea5ded5d83ea45f1caf39da9783775c8c8c65d30795f41ed6eff45e1b',
  receiverId: provider.accountId,
}).then((mutation) => {
    return mutation.complete();
});
```

::: tip
The `provider.accountId` is your currently selected MetaMask account. If you want someone else to be the receiver, enter their address instead.
:::

Now that we became a proud owner of a new asset, we will try to transfer it to another wallet. As an Owner of an asset, you can transfer your ownership to someone else. However, this action cannot be reverted; and once it is done, you will lose all access to that asset. The only way to get it back is asking the new owner to send it back to you.

```ts
const mutation = await assetLedger.transferAsset({
    receiverId: provider.accountId,
    id: '100',
}).then((mutation) => {
    return mutation.complete();
});
```

::: warning
In the example above, you are transfering the asset to yourself. The `receiverId` is therefore your own accountId. If you want to transfer the asset to someone else, enter their wallet address as `receiverId` instead.
:::

By now, the `100` token should appear in the new wallet. Let's verify this.

```ts
const ownerId = await assetLedger.getAssetAccount('100');
//=> 0x...
```

For more details, please refer to the [API](/api/core.html) section.

---

The 0xcert Framework covers not only assets, but also cryptocurrencies or values. Let's dive into [values on the blockchain](/guide/about-cryptocurrency.html).
