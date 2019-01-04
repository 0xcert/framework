# Asset management

Each asset always belongs to the structure within a storage called Asset Ledger. As discussed in one of the previous sections, a ledger represents a folder containing the assets of a specific issuer and related owners. Only users authorized by the ledger owner are allowed to manage the ledger. Depending on its configuration, authorized persons can handle the ledger and thus create and manage its assets.

On the Ethereum blockchain, an asset ledger represents a smart contract that complies with the ERC-721 standard. The 0xcert Framework follows this standard and adds some extra functions visible in the [API]().

## Installation

We recommend you employ the asset ledger module as an NPM package in your application.

```shell
$ npm i --save @0xcert/ethereum-asset-ledger
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript files that you can directly include in your website. Please refer to the [API]() section to learn more about asset ledger.

## Usage overview

First, you need to deploy a new asset ledger to the Ethereum blockchain. If you want to save time doing it, you can leverage an already deployed asset ledger, available on the Ropsten network with an ID `XXX`. In this case, make sure your MetaMask is indeed connected to the Ropsten network for the purpose of this test.

```ts
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

const assetLedgerId = mutation.receiverId;
```

Now that a new asset ledger has been deployed on the network, you can create a new instance of this new asset ledger.

```ts
const assetLedger = AssetLedger.getInstance(provider, assetLedgerId);
```

We can now perform `query` and `mutation` requests on this newly deployed asset ledger. Below is an example of a query that retrieves general information about this asset ledger.

```ts
const assetLedgerInfo = await assetLedger.getInfo();
//=> { name: 'Certificate', symbol: 'CERT', uriBase: 'http://domain.com', schemaId: '239423' }
```

This query should respond with similar information to the one we defined when we deployed a new asset ledger. At the beginning of this section, we explained the asset ledger as a book of ownership records. The items contained in this book are called `Assets`. It's time to create a new asset to which we determine its unique ID `100`. In the example below, we can create a new asset and send it to our main account marked with `receiverId`. We use the imprint from the previous section where we went through the process of asset certification.

```ts
const mutation = await assetLedger.createAsset({
  id: '100',
  imprint: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb',
  receiverId: '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
}).then((mutation) => {
    return mutation.complete();
});
```

Now that we became a proud owner of a new asset, we will try to transfer it to another wallet. For that, we create a new account in MetaMask and insert the wallet address as `receiverId` in the code snippet below. As an Owner of an asset, you can transfer your ownership to someone else. This action cannot be reverted, and once it is done, you lose all rights to that asset. The only way to get that asset back is for the new owner to send it back to you.

```ts
const mutation = await assetLedger.transferAsset({
    receiverId: provider.accountId,
    id: '100',
}).then((mutation) => {
    return mutation.complete();
});
```

::: Warning
In the example above you are transfering the asset to yourself that is why the receiverId is your own accountId.
::: 

By now, the `100` token should appear in the new wallet. Let's verify this.

```ts
const ownerId = await assetLedger.getAssetAccount('100');
//=> 0x...
```

For more details, please refer to the [API]() section.
