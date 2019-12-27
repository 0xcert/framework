# Asset Management

When discussing assets, we think of different things of value. The simplest examples are the items you keep in your physical wallet, like cash in banknotes and coins, ID cards, a driver's license, credit cards, etc. While these items can all be classified as assets, when talking about an asset in the context of the 0xcert Framework, **an asset represents something unique**.

So if we reconsider the items described above, some of them no longer fall into the category of an asset - namely banknotes and coins. Why is that? That is because if you exchange a $10 bill with Sara's $10 bill, you both will retain the same value. But if you exchange your ID card with Sara's, that ceases to be true. If you would like to know how to work with the kind of items holding the same value, such as banknotes and coins, check out the [Value management guide]().

Another thing to consider is that the example above illustrated the use of physical items, whereas the 0xcert Framework allows for operations with digital unique (non-fungible) assets. Luckily, most physical items can be simply represented in a digital format using IDs and meta descriptions. 

Unique digital assets are represented on the Ethereum blockchain following the [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) standard. This standard defines how the basic smart contract looks like and how every non-fungible token is defined. To incorporate full-range functionalities, the 0xcert Framework enhanced the base ERC-721 code with additional functionalities to create what we now call an Xcert. Xcert is a fully ERC-721-compatible non-fungible token format with added [certification]() and other useful functionalities.

Xcert is a smart contract that contains assets of a specific kind. When creating an Xcert, you define what properties the assets created within it will have. For example, let's say you are a KYC provider. You define what properties a KYC asset needs, and you create an Xcert with these properties defined. Now each KYC asset you issue on this smart contract needs to follow its rules. To learn more about this, check the [certification]() section.

An asset ledger connects directly to an Xcert smart contract on the blockchain. Thus, the things you do with an asset ledger are directly reflected on the blockchain. An asset you create on an `AssetLedger` directly translates to an asset created on the underlying `Xcert` smart contract.

TLDR: An asset ledger is a container defining how assets in it look like. An asset, however, is a unique digital representation of an item that is created on an asset ledger and follows its definition.

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-asset-management?module=%2FREADME.md) to check the live example for this section.
:::

## Installation

We recommend you employ the asset ledger module as an NPM package in your application.

```ell
$ npm i --save @0xcert/ethereum-asset-ledger
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that you can directly include in your website. Please refer to the [API](/api/core.html) section to learn more about asset ledger.

## Creating a new AssetLedger

We begin by importing the modules.

```ts
import { AssetLedger, AssetLedgerCapability } from '@0xcert/ethereum-asset-ledger';
```

Now let's define the AssetLedger that we want to deploy.

```ts
const assetLedgerDefinition = {
  name: 'Math Course Certificate',
  symbol: 'MCC',
  uriPrefix: 'https://0xcert.org/assets/',
  uriPostfix: '.json',
  schemaId: '3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d', // base asset schemaId
  capabilities: [
    AssetLedgerCapability.REVOKE_ASSET,
  ],
};
```

Here, we name and set a symbol to our asset ledger. We decide where the asset metadata will live (off-chain descriptive data about each asset) by defining the `uriPrefix` and `uriPostfix`. Combining the `uriPrefix` with asset ID and `uriPostfix`, we get the URI of each asset's metadata location. Through the [Certification guide](), we define the schemaId, and through [capabilities](), we decide what additional functionalities the asset ledger will possess (this cannot be changed once a ledger is deployed).

Finally, we deploy the asset ledger.

```ts
const mutation = await AssetLedger.deploy(provider, assetLedgerDefinition);
```

Deployment is an asynchronous action that is performed on the blockchain. Deployment thus returns a [Mutation]() object, which allows us to properly react to this in a way that is most beneficial to the application and the user experience we want to create.

For this example, let's first show our user a transaction hash so they can see that something is happening and can check it in a block explorer.

```ts
const transactionHash = mutation.id;
```

Now, since we cannot do anything until the asset ledger is deployed, we can wait for the transaction to be accepted onto the blockchain and then get the smart contract address of the newly created asset ledger.

```ts
await mutation.complete();
const assetLedgerId = mutation.receiverId;
```

Now that a new asset ledger has been deployed on the network, you can create a new instance of it.

```ts
const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
```

To check if everything has been deployed as we wanted it, let's read the asset ledger information.

```ts
const assetLedgerInfo = await assetLedger.getInfo();
//=> { name: 'Math Course Certificate', symbol: 'MCC', uriPrefix: 'https://0xcert.org/assets/', uriPostfix: '.json', schemaId: '3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d', supply: '0' }
```

## Creating a new asset

To create a new asset, let's first go through the [Certification guide]() and generate an imprint. Now, we can create a new asset.

```ts
const mutation = await assetLedger.createAsset({
  id: '100',
  imprint: 'aa431acea5ded5d83ea45f1caf39da9783775c8c8c65d30795f41ed6eff45e1b',
  receiverId: provider.accountId,
}).then((mutation) => {
    return mutation.complete();
});
```

We set the asset's `id` to `100`, and for the `receiverId`, we set `provider.accountId`, which means we are creating it for ourselves. We are also waiting for the transaction to complete before we move onto the next stage.

::: tip
The `provider.accountId` is your currently selected MetaMask account. If you want someone else to be the receiver, enter their address instead.
:::

Now that the asset is created, let's check who its owner is.

```ts
const ownerId = await assetLedger.getAssetAccount('100');
//=> 0x...
```

## Transfer an asset

::: tip
You can only transfer an asset if you are either the asset owner or if you have been authorized by the asset owner to operate with it on their behalf.
:::

To transfer an asset, you only need to know the `id` of the asset you want to transfer and who you want to transfer it to.

```ts
const mutation = await assetLedger.transferAsset({
    receiverId: provider.accountId,
    id: '100',
}).then((mutation) => {
    return mutation.complete();
});
```

Here, we specified `receiverId` as `provider.accountId`, which means we are transferring this asset to ourselves. Change the receiverId to another address so that the asset will change ownership.

Verify that the asset has been successfully transferred by checking who its new owner is.

```ts
const ownerId = await assetLedger.getAssetAccount('100');
//=> 0x...
```
