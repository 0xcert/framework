# API

## Metamask provider

MetaMask provider is applied for in-browser use. The user should have the [MetaMask](https://metamask.io/) installed. The provider automatically establishes a communication channel with MetaMask, which further performs communication with the Ethereum blockchain.

### MetamaskProvider(options)

A `class` providing the communication with the Ethereum blockchain through [MetaMask](https://metamask.io/).

**Arguments**

| Argument | Description
|-|-|-
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file.
| options.requiredConfirmations | An `integer` which represents the number of confirmation needed for mutations to be considered as confirmed. It defaults to `1`.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 stransfers.
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file.

**Usage**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';

const provider = new MetamaskProvider();
```

**See also:**

[HttpProvider](#http-provider)

### enable()

TODO

### getInstance(options)

TODO

### isSupported()

TODO

### isEnabled()

TODO

### post(options)

TODO

## HTTP provider

HTTP provider uses HTTP in HTTPS protocol for communication with the Ethereum node. It is used mostly for querying and mutating data but does not support subscriptions.

> Don't forger to manually unlock your account before performing a mutation.

### HttpProvider(options)

A `class` providing the communication with the Ethereum blockchain using the HTTP/HTTPS protocol.

**Arguments**

| Argument | Description
|-|-|-
| options.accountId | [required] A `string` representing the Ethereum account that will perform actions.
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file.
| options.cache | A `string` representing request cache type. It defaults to `no-cache`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.credentials | A `string` representing request credentials. It defaults to `omit`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.headers | An `object` of request headers. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mode | A `string` representing request mode. It defaults to `same-origin`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.redirect | A `string` representing request redirect mode. It defaults to `follow`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.requiredConfirmations | An `integer` which represents the number of confirmation needed for mutations to be considered as confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. The available options are `0` (eth_sign) or `2` (EIP-712). It default to `0`.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 stransfers.
| options.url | [required] A `string` representing the URL to the Ethereum node's JSON RPC.
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file.

**Usage**

```ts
import { HttpProvider } from '@0xcert/ethereum-http-provider';

const provider = new HttpProvider({
    accountId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
    url: 'https://ropsten.infura.io/v3/06312ac7a50b4bd49762abc5cf79dab8',
});
```

**See also:**

[MetamaskProvider](#metamask-provider)

### getInstance(options)

TODO

### isSupported()

TODO

### post(options)

TODO

## Asset Certificate

TODO

## Asset Schema

TODO

## Asset Ledger

Asset ledger represents ERC-721 related smart contract on the Ethereum blockchain.

### AssetLedger(provider, ledgerId)

A `class` which represents a smart contract on the Ethereum blockchain.

**Arguments**

| Argument | Description
|-|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum blockchain.
| provider | [required] An instance of a HTTP or MetaMask provider.

**Usage**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const provider = new MetamaskProvider();
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// create ledger instance
const ledger = new AssetLedger(provider, ledgerId);
```

### approveAccount(assetId, accountId)

An `asynchronous` class instance `function` which approves a third party `accountId` to taker over a specific `assetId`. This function succeeds only when performed by the asset's owner. Note that that only one account can be approved at the same time thus running this function multiple times will override previously set data.

**Arguments:**

| Argument | Description
|-|-|-
| assetId | [required] A `string` representing the ID of an asset.
| accountId | [required] A `string` representing the new owner's Ethereum account address or an instance of the OrderGateway class.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver.
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
// arbitrary data 
const assetId = '100';
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// perform the mutation
const mutation = await ledger.approveAccount(assetId, accountId);
```

**See also:**

[disapproveAccount](#disapprove-account), [approveOperator](#approve-operator)

### approveOperator(accountId)

An `asynchronous` class instance `function` which approves third party `accountId` to taker over the management of all the assets of the account that performed this mutation. Note that multiple operators can exist.

**Arguments:**

| Argument | Description
|-|-|-
| accountId | [required] A `string` representing the new owner's Ethereum account address or an instance of the OrderGateway class.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing an ID of the Ethereum transaction.
| receiverId | A `string` representing an Ethereum account address of a receiver.
| senderId | A `string` representing an Ethereum account address of a sender.

**Usage:**

```ts
// arbitrary data 
const assetId = '100';
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// perform the mutation
const mutation = await ledger.approveOperator(accountId);
```

**See also:**

[disapproveOperator](#disapprove-operator), [approveAccount](#approve-account)

### assignAbilities(accountId, abilities)

An `asynchronous` class instance `function` which assignes management permissions for this ledger to a third party `accountId`. The `MANAGE_ABILITIES` ledger ability is required to perform this function.

**Arguments:**

| Argument | Description
|-|-|-
| accountId | [required] A `string` representing the Ethereum account address that will get new management permissions on this ledger.
| abilities | [required] A array of `integers` representing this ledger's smart contract abilities.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver.
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
import { AssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const abilities = [
    AssetLedgerAbility.CREATE_ASSET,
    AssetLedgerAbility.TOGGLE_TRANSFERS,
];

// perform the mutation
const mutation = await ledger.assignAbilities(accountId, abilities);
```

### createAsset(recipe)

An `asynchronous` class instance `function` which creates a new asset on the Ethereum blockchain. The `CREATE_ASSET` ledger ability is needed to perform this function.

**Arguments:**

| Argument | Description
|-|-|-
| recipe.id | [required] A `string` which represents a unique asset ID.
| recipe.imprint | A `string` which represents asset imprint generated by using `Cert` class.
| recipe.receiverId | [required] A `string` representing Ethereum account address that will receive the new asset.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver.
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
// arbitrary data
const asset = {
    id: '100',
    imprint: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb',
    receiverId: '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
};

// perform the mutation
const mutation = await ledger.createAsset(asset);
```

**See also:**

[Cert](#cert)

### deploy(provider, recipe)

An `asynchronous` static class `function` which deploys a new asset ledger to the Ethereum blockchain. Note that all ledger abilities are automatically assigned to the account that performs this method.

**Arguments:**

| Argument | Description
|-|-|-
| provider | [required] An instance of a HTTP or MetaMask provider.
| recipe.name | [required] A `string` representing asset ledger name.
| recipe.symbol | [required] A `string` representing asset ledger symbol.
| recipe.uriBase | [required] A `string` representing base asset URI. 
| recipe.schemaId | [required] A `string` representing data schema ID.
| recipe.capabilities | A list of `integers` which represent ledger capabilities.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver (you have to wait for the mutation to be confirmed).
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger, AssetLedgerCapability } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const provider = new MetamaskProvider();
const capabilities = [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
];
const recipe = {
    name: 'Math Course Certificate',
    symbol: 'MCC',
    uriBase: 'http://domain.com/assets/',
    schemaId: '0x0000000000000000000000000000000000000000000000000000000000000000',
    capabilities,
};

// perform the mutation
const mutation = await AssetLedger.deploy(provider, recipe).then((mutation) => {
    return mutation.resolve(); // wait until first confirmation
});
```

### destroyAsset(assetId)

An `asynchronous` class instance `function` which destroys a specific `assetId` on the Ethereum blockchain. The asset is removed from the account but stays logged in the blockchain. Note that the `BURN_ASSET` ledger capability is needed to perform this function. The function succeeds only when performed by the asset's owner.

**Arguments:**

| Argument | Description
|-|-|-
| assetId | [required] A `string` which represents the asset ID.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver.
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
// arbitrary data
const assetId = '100';

// perform the mutation
const mutation = await ledger.destroyAsset(assetId);
```

**See also:**

[revokeAsset](#revoke-asset)

### disapproveAccount(assetId)

An `asynchronous` class instance `function` which removes the ability of the currently set third party account to taker over a specific `assetId`. Note that this function succeeds only when performed by the asset's owner.

**Arguments:**

| Argument | Description
|-|-|-
| assetId | [required] A `string` which represents the asset ID.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver.
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
// arbitrary data
const assetId = '100';

// perform the mutation
const mutation = await ledger.disapproveAccount(assetId);
```

**See also:**

[disapproveOperator](#disapprove-operator), [approveAccount](#approve-account)

### disapproveOperator(accountId)

An `asynchronous` class instance `function` which removes the third party `accountId` the ability of managing assets of the account that performed this mutation.

**Arguments:**

| Argument | Description
|-|-|-
| accountId | [required] A `string` representing the new Ethereum account address or an instance of the OrderGateway class.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver.
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// perform the mutation
const mutation = await ledger.disapproveOperator(accountId);
```

**See also:**

[disapproveAccount](#disapprove-account), [approveOperator](#approve-operator)

### disableTransfers()

An `asynchronous` class instance `function` which disables all asset transfers. The `TOGGLE_TRANSFERS` ledger ability and `TOGGLE_TRANSFERS` ledger capability are required to perform this function.

**Result:**

| Key | Description
|-|-|-
| confirmations | An `integer` representing Ethereum transaction confirmations.
| id | A `string` representing the ID of the Ethereum transaction.
| receiverId | A `string` representing Ethereum address of a receiver.
| senderId | A `string` representing Ethereum address of a sender.

**Usage:**

```ts
// perform the mutation
const mutation = await ledger.disableTransfers();
```

**See also:**

[enableTransfers](#enable-transfer)

### enableTransfers()

### getAbilities(accountId)

### getApprovedAccount(assetId)

### getAsset(assetId: string)

### getAssetAccount(assetId: string)

### getBalance(accountId: string)

### getCapabilities()

An `asynchronous` class instance `function` that returns a array of numbers representing ledger's capabilities.

**Usage:**

```ts
// perform the query
const capabilities = await ledger.getCapabilities();
```

### getInfo()

An `asynchronous` class instance `function` that returns an object with general information about the ledgr.

**Result:**

| Key | Description
|-|-|-
| name | A `string` which representsasset ledger's name.
| symbol | A `string` which represents asset ledger's symbol.
| uriBase | A `string` which represents base asset URI.
| schemaId | A `string` which represents data schema ID.
| supply | A big number `string` which represents the total number of issued assets.

**Usage:**

```ts
// perform the query
const info = await ledger.getInfo();
```

### getInstance(provider, ledgerId)

A static class `function` that returns a new instance of the AssetLedger class (allias for `new AssetLedger`).

**Arguments**

| Argument | Description
|-|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum network.
| provider | [required] An instance of a HTTP or MetaMask provider.

**Usage**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const provider = new MetamaskProvider();
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// create ledger instance
const ledger = AssetLedger.getInstance(provider, ledgerId);
```

### id

A class instance `variable` holding the address of ledger's smart contract on the Ethereum blockchain.

### isApprovedAccount(assetId, accountId)

### isApprovedOperator(accountId, operatorId)

### isTransferable()

### revokeAbilities(accountId, abilities)

### revokeAsset(assetId)

### update(recipe)

### updateAsset(assetId, recipe)

### transferAsset(recipe)

## Ledger Abilities

Ledger abilities represent account-level permissions.

**Options:**

| Name | Value | Description
|-|-|-
| CREATE_ASSET | 1 | Allows an account to create a new asset.
| MANAGE_ABILITIES | 0 | Allows an account to further assign abilities.
| REVOKE_ASSET | 2 | Allows management accounts to revoke assets.
| TOGGLE_TRANSFERS | 3 | Allows an account to stop and start asset transfers.
| UPDATE_ASSET | 4 | Allows an account to update asset data.
| UPDATE_URI_BASE | 6 | Allows an account to update asset ledger's base URI.

**Usage:**

```ts
import { AssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

const abilities = [
    AssetLedgerAbility.TOGGLE_TRANSFERS,
];
```

## Ledger Capabilities

Ledger capabilities represent features of a smart contract.

**Options:**

| Name | Value | Description
|-|-|-
| BURN_ASSET | 1 | Enables asset owners to burn their assets.
| UPDATE_ASSET | 2 | Enables ledger managers to update asset data.
| REVOKE_ASSET | 4 | Enables ledger managers to revoke assets.
| TOGGLE_TRANSFERS | 3 | Enables ledger managers to start and stop asset transfers.

**Usage:**

```ts
import { AssetLedgerCapability } from '@0xcert/ethereum-asset-ledger';

const capabilities = [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
];
```

## Value Ledger

TODO

### ValueLedger(provider, ledgerId)

TODO

### approveValue(accountId, value)

TODO

### deploy(provider, recipe)

TODO

### disapproveValue(accountId)

TODO

### getApprovedValue(accountId, spenderId)

TODO

### getBalance(accountId)

TODO

### getInfo()

TODO

### getInstance(provider, id)

TODO

### id

TODO

### isApprovedValue(accountId, spenderId, value)

TODO

### transferValue(data)

TODO

## Orders Gateway

TODO

### cancel(order)

TODO

### claim(order)

TODO

### getInstance(provider, id)

TODO

### id

TODO

### perform(order, claim)

TODO

