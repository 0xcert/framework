# API / Wanchain

## HTTP provider

HTTP provider uses HTTP and HTTPS protocol for communication with the Wanchain node. It is used mostly for querying and mutating data but does not support subscriptions.

::: warning
Don't forget to manually unlock your account before performing a mutation.
:::

### HttpProvider(options)

A `class` providing communication with the Wanchain blockchain using the HTTP/HTTPS protocol.

**Arguments**

| Argument | Description
|-|-
| options.accountId | [required] A `string` representing the Wanchain account that will perform actions.
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file.
| options.cache | A `string` representing request cache type. It defaults to `no-cache`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.credentials | A `string` representing request credentials. It defaults to `omit`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.headers | An `object` of request headers. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mode | A `string` representing request mode. It defaults to `same-origin`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mutationTimeout | A `number` representing the number of milliseconds in which a mutation times out. Defaults to `3600000`. You can set it to `-1` for disable timeout.
| options.orderGatewayId | A `string` representing an Wanchain address of the [order gateway](/#public-addresses).
| options.redirect | A `string` representing request redirect mode. It defaults to `follow`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.requiredConfirmations | An `integer` represeting the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. The available options are `0` (eth_sign) or `2` (EIP-712) or `3` (perosnal_sign). It defaults to `0`.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers.
| options.url | [required] A `string` representing the URL to the Wanchain node's JSON RPC.
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file.

**Usage**

```ts
import { HttpProvider } from '@0xcert/wachain-http-provider';

const provider = new HttpProvider({
    accountId: '0x...',
    url: 'https://connection-to-wanchain-rpc-node/',
});
```

::: warning
Please note, when using [Infra](http://infra.wanchainx.exchange/), only queries are supported.
:::

### assetLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.

### getAvailableAccounts()

An `asynchronous` class instance `function` which returns currently available Wanchain wallet addresses.

**Result:**

A list of `strings` representing Wanchain account IDs.

**Example:**

```ts
// perform query
const accountIds = await provider.getAvailableAccounts();
```

### getInstance(options)

A static class `function` that returns a new instance of the HttpProvider class (alias for `new HttpProvider`).

**Arguments**

See the class [constructor](#http-provider) for details.

**Usage**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';

// create provider instance
const provider = HttpProvider.getInstance();
```

### getNetworkVersion()

An `asynchronous` class instance `function` which returns Wanchain network version (e.g. `1` for Wanchain Mainnet).

**Result:**

A `string` representing Wanchain network version.

**Example:**

```ts
// perform query
const version = await provider.getNetworkVersion();
```

### isCurrentAccount(accountId)

A `synchronous` class instance `function` which returns `true` when the provided `accountId` maches the currently set account ID.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing Wanchain account address.

**Result:**

A `boolean` which tells if the `accountId` maches the currently set account ID.

**Example:**

```ts
// wanchain wallet address
const walletId = '0x...';

// perform query
const maches = provider.isCurrentAccount(walletId);
```

### isSupported()

A `synchronous` class instance `function` which returns `true` when the provider is supported by the environment.

**Result:**

A `boolean` which tells if the provider can be used.

**Example:**

```ts
// perform query
const isSupported = provider.isSupported();
```

### isUnsafeRecipientId(ledgerId)

A `synchronous` class instance `function` which returns `true` when the provided `ledgerId` is listed among unsafe recipient ids on the provided.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Wanchain blockchain.

**Result:**

A `boolean` which tells if the `id` is unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const unsafeId = '0x...';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(unsafeId);
```

**See also:**

[unsafeRecipientIds](#unsaferecipientids-2)

### mutationTimeout

A class instance `variable` holding an `integer` number of milliseconds in which a mutation times out.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second is the old one.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/wanchain-http-provider';

provider.on(ProviderEvent.ACCOUNT_CHANGE, (accountId) => {
  console.log('Account has changed', accountId);
});
```

**See also:**

[once (event, handler)](#once-event-handler), [off (event, handler)](#off-event-handler)

### once(event, handler);

A `synchronous` class instance `function` which attaches a new event handler. The event is automatically removed once the first `event` is emitted.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second is the old one.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/wanchain-http-provider';

provider.on(ProviderEvent.ACCOUNT_CHANGE, (accountId) => {
  console.log('Account has changed', accountId);
});
```

**See also:**

[on (event, handler)](#on-event-handler), [off (event, handler)](#off-event-handler)

### off(event, handler)

A `synchronous` class instance `function` which removes an existing event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](#provider-events) name.
| handler | A specific callback `function` of an event. If not provided, all handlers of the `event` are removed.

**Result:**

An instance of the same provider  class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/wanchain-http-provider';

provider.off(ProviderEvent.NETWORK_CHANGE);
```

**See also:**

[on (event, handler)](#on-event-handler), [once (event, handler)](#once-event-handler)

### orderGatewayId

A class instance `variable` holding a `string` which represents an Wanchain address of the [order gateway](/#public-addresses).

### requiredConfirmations

A class instance `variable` holding a `string` which represents the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.

### signMethod

A class instance `variable` holding a `string` which holds a type of signature that will be used (e.g. when creating claims).

### unsafeRecipientIds

A class instance `variable` holding a `string` which represents smart contract addresses that do not support safe ERC-721 transfers.

### valueLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

## Provider events

We can listen to different provider events. Note that not all the providers are able to emit all the events listed here.

**Options:**

| Name | Value | Description
|-|-|-
| ACCOUNT_CHANGE | accountChange | Triggered when an `accountId` is changed.
| NETWORK_CHANGE | networkChange | Triggered when network version is changed.

**Example:**

```ts
provider.on(ProviderEvent.ACCOUNT_CHANGE, (accountId) => {
    console.log('Account has changed', accountId);
});
provider.on(ProviderEvent.NETWORK_CHANGE, (networkVersion) => {
    console.log('Network has changed', networkVersion);
});
```

## Mutation

The 0xcert Framework performs mutations for any request that changes the state on the Wanchain blockchain.

### Mutation(provider, mutationId)

A `class` which handles transaction-related operations on the Wanchain blockchain.

**Arguments**

| Argument | Description
|-|-|-
| mutationId | [required] A `string` representing a hash string of an Wanchain transaction.
| provider | [required] An instance of an HTTP provider.

**Usage**

```ts
import { Mutation } from '@0xcert/wanchain-http-provider';

// arbitrary data
const mutationId = '0x...';

// create mutation instance
const mutation = new Mutation(provider, mutationId);
```

### complete()

An `asynchronous` class instance `function` which waits until the mutation reaches the specified number of confirmations.

::: tip
Number of required confirmations is configurable through the provider instance.
:::

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// wait until confirmed
await mutation.complete();
```

**See also:**

[forget()](#forget)

### confirmations

A class instance `variable` holding an `integer` number of confirmations reached. Default is `0`.

### emit(event, options);

A `synchronous` class instance `function` to manually trigger a mutation event.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [mutation event](#mutation-events) name.
| options | For `ERROR` event, an instance of an `Error` must be provided.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/wanchain-http-provider';

mutation.emit(MutationEvent.ERROR, new Error('Unhandled error'));
```

### forget()

A `synchronous` class instance `function` which stops listening for confirmations which causes the `complete()` function to resolve immediately.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
mutation.forget();
```

### id

A class instance `variable` holding a `string` which represents a hash of an Wanchain transaction.

### isCompleted()

A `synchronous` class instance `function` which returns `true` if a mutation has reached the required number of confirmations.

**Result:**

A `boolean` telling if the mutation has been completed.

**Example:**

```ts
mutation.isCompleted();
```

**See also:**

[isPending](#is-pending)

### isPending()

A `synchronous` class instance `function` which returns `true` when a mutation is in the process of completion.

**Result:**

A `boolean` telling if the mutation is waiting to be confirmed.

**Example:**

```ts
mutation.isPending();
```

**See also:**

[isPending](#is-pending)

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [mutation event](#mutation-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ERROR`, the first argument is an `Error`, otherwise the current `Mutation` instance is received.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/wanchain-http-provider';

mutation.on(MutationEvent.COMPLETE, () => {
    console.log('Mutation has been completed!');
});
```

**See also:**

[once(event, handler)](#once-event-handler), [off (event, handler)](#off-event-handler)

### once(event, handler);

A `synchronous` class instance `function` which attaches a new event handler. The event is automatically removed once the first `event` is emitted.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [mutation event](#mutation-events) name.
| handler | A callback `function` which is triggered on each `event`. When the `event` equals `ERROR`, the first argument is an `Error`, otherwise the current `Mutation` instance is received.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/wanchain-http-provider';

mutation.once(MutationEvent.COMPLETE, () => {
    console.log('Mutation has been completed!');
});
```

**See also:**

[on (event, handler)](#on-event-handler), [off (event, handler)](#off-event-handler)

### off(event, handler)

A `synchronous` class instance `function` which removes an existing event.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [mutation event](#mutation-events) name.
| handler | A specific callback `function` of an event. If not provided, all handlers of the `event` are removed.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/wanchain-http-provider'; 

mutation.off(MutationEvent.ERROR);
```

**See also:**

[on (event, handler)](#on-event-handler), [once (event, handler)](#once-event-handler)

### receiverId

A class instance `variable` holding a `string` which represents an Wanchain account address that plays the role of a receiver.

::: tip
When you are deploying a new ledger, this variable represents the ledger ID and is `null` until a mutation is completed.
:::

### senderId

A class instance `variable` holding a `string` which represents an Wanchain account address that plays the role of a sender.

## Mutation events

We can listen to different mutation events which are emitted by the mutation in the process of completion.

**Options:**

| Name | Value | Description
|-|-|-
| COMPLETE | complete | Triggered when a mutation reaches required confirmations.
| CONFIRM | confirm | Triggered on each confirmation until the required confirmations are reached.
| ERROR | error | Triggered on mutation error.

**Example:**

```ts
mutation.on(MutationEvent.COMPLETE, () => {
    console.log('Mutation has been completed!');
});
```

## Asset ledger

Asset ledger represents ERC-721 related smart contract on the Wanchain blockchain.

### AssetLedger(provider, ledgerId)

A `class` which represents a smart contract on the Wanchain blockchain.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Wanchain blockchain.
| provider | [required] An instance of an HTTP provider.

**Example:**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
import { AssetLedger } from '@0xcert/wanchain-asset-ledger';

// arbitrary data
const provider = new HttpProvider({ url: 'https://...' });
const ledgerId = '0x...';

// create ledger instance
const ledger = new AssetLedger(provider, ledgerId);
```

### approveAccount(assetId, accountId)

An `asynchronous` class instance `function` which approves a third-party `accountId` to take over a specific `assetId`. This function succeeds only when performed by the asset's owner.

::: tip
Only one account per `assetId` can be approved at the same time thus running this function multiple times will override previously set data.
:::

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| accountId | [required] A `string` representing the new owner's Wanchain account address or an instance of the `OrderGateway` class.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';
const accountId = '0x...';

// perform mutation
const mutation = await ledger.approveAccount(assetId, accountId);
```

**See also:**

[disapproveAccount](#disapprove-account), [approveOperator](#approve-operator)

### approveOperator(accountId)

An `asynchronous` class instance `function` which approves the third-party `accountId` to take over the management of all the assets of the account that performed this mutation.

::: tip
Multiple operators can exist.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing an Wanchain account address or an instance of the `OrderGateway` class that will receive new management permissions on this ledger.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';
const accountId = '0x...';

// perform mutation
const mutation = await ledger.approveOperator(accountId);
```

**See also:**

[disapproveOperator](#disapprove-operator), [approveAccount](#approve-account)

### createAsset(recipe)

An `asynchronous` class instance `function` which creates a new asset on the Wanchain blockchain.

::: warning
The `CREATE_ASSET` ledger ability is needed to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| recipe.id | [required] A `string` representing a unique asset ID.
| recipe.imprint | [required] A `string` representing asset imprint generated by using `Cert` class.
| recipe.receiverId | [required] A `string` representing an Wanchain account address that will receive the new asset.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const asset = {
    id: '100',
    imprint: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb',
    receiverId: '0x...',
};

// perform mutation
const mutation = await ledger.createAsset(asset);
```

**See also:**

[Cert](#cert)

### deploy(provider, recipe)

An `asynchronous` static class `function` which deploys a new asset ledger to the Wanchain blockchain.

::: tip
All ledger abilities are automatically granted to the account that performs this method.
:::

**Arguments:**

| Argument | Description
|-|-
| provider | [required] An instance of an HTTP provider.
| recipe.name | [required] A `string` representing asset ledger name.
| recipe.symbol | [required] A `string` representing asset ledger symbol.
| recipe.uriBase | [required] A `string` representing base asset URI.
| recipe.schemaId | [required] A `string` representing data schema ID.
| recipe.capabilities | A list of `integers` which represent ledger capabilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { HttpProcider } from '@0xcert/wanchain-http-provider';
import { AssetLedger, AssetLedgerCapability } from '@0xcert/wanchain-asset-ledger';

// arbitrary data
const provider = new HttpProvider({ 
    url: 'https://...',
    accountId: '0x...' 
});
const capabilities = [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
];
const recipe = {
    name: 'Math Course Certificate',
    symbol: 'MCC',
    uriBase: 'http://domain.com/assets/',
    schemaId: '0x3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d', // base asset schemaId
    capabilities,
};

// perform mutation
const mutation = await AssetLedger.deploy(provider, recipe).then((mutation) => {
    return mutation.complete(); // wait until first confirmation
});
```

### destroyAsset(assetId)

An `asynchronous` class instance `function` which destroys a specific `assetId` on the Wanchain blockchain. The asset is removed from the account and all queries about it will be invalid. The function succeeds only when performed by the asset's owner. This function is similar to `revokeAsset` but it differs in who can trigger it.

::: warning
The `DESTROY_ASSET` ledger capability is needed to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing the asset ID.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';

// perform mutation
const mutation = await ledger.destroyAsset(assetId);
```

**See also:**

[revokeAsset](#revokeasset-assetid)

### disapproveAccount(assetId)

An `asynchronous` class instance `function` which removes the ability of the currently set third-party account to take over a specific `assetId`. This function succeeds only when performed by the asset's owner.

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing the asset ID.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';

// perform mutation
const mutation = await ledger.disapproveAccount(assetId);
```

**See also:**

[disapproveOperator](#disapprove-operator), [approveAccount](#approve-account)

### disapproveOperator(accountId)

An `asynchronous` class instance `function` which removes the third-party `accountId` the ability of managing assets of the account that performed this mutation.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the new Wanchain account address or an instance of the `OrderGateway` class.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';

// perform mutation
const mutation = await ledger.disapproveOperator(accountId);
```

**See also:**

[disapproveAccount](#disapprove-account), [approveOperator](#approve-operator)

### disableTransfers()

An `asynchronous` class instance `function` which disables all asset transfers.

::: warning
The `TOGGLE_TRANSFERS` ledger ability and `TOGGLE_TRANSFERS` ledger capability are required to perform this function.
:::

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// perform mutation
const mutation = await ledger.disableTransfers();
```

**See also:**

[enableTransfers](#enable-transfer)

### enableTransfers()

An `asynchronous` class instance `function` which enables all asset transfers.

::: warning
The `TOGGLE_TRANSFERS` ledger ability and `TOGGLE_TRANSFERS` ledger capability are required to perform this function.
:::

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// perform mutation
const mutation = await ledger.enableTransfers();
```

**See also:**

[disableTransfers](#disable-transfers)

### getAbilities(accountId)

An `asynchronous` class instance `function` which returns `accountId` abilities.

**Result:**

An `array` of `integer` numbers representing account abilities.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';

// perform query
const abilities = await ledger.getAbilities(accountId);
```

### getAccountAssetIdAt(accountId, index)

An `asynchronous` class instance `function` which returns the asset id at specified `index` for desired `accountId`.

::: warning
The function might fail on some third party ERC721 contracts. If the token contract is not enumerable, this function will always return `null`.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Wanchain account address.
| index | [required] A `number` representing the asset index.

**Result:**

A `number` representing the asset id.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';
const index = 0; // the account has 3 tokens on indexes 0, 1 and 2

// perform query
const assetId = await ledger.getAccountAssetIdAt(accountId, index);
```

### getApprovedAccount(assetId)

An `asynchronous` class instance `function` which returns an account ID of a third party which is able to take over a specific `assetId`.

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing an asset ID.

**Result:**

A `string` representing account ID.

**Example:**

```ts
// arbitrary data
const assetId = '100';

// perform query
const accountId = await ledger.getApprovedAccount(assetId);
```

**See also:**

[approveAccount](#approve-account)

### getAsset(assetId)

An `asynchronous` class instance `function` which returns `assetId` data.

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing the asset ID.

**Result:**

| Key | Description
|-|-
| id | A `string` representing asset ID.
| uri | A `string` representing asset URI which points to asset public metadata.
| imprint | A `string` representing asset imprint.

**Example:**

```ts
// arbitrary data
const assetId = '100';

// perform query
const data = await ledger.getAsset(assetId);
```

### getAssetAccount(assetId)

An `asynchronous` class instance `function` which returns an account ID that owns the `assetId`.

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing the asset ID.

**Result:**

A `string` which represents an account ID.

**Example:**

```ts
// arbitrary data
const assetId = '100';

// perform query
const accountId = await ledger.getAssetAccount(assetId);
```

### getAssetIdAt(index)

An `asynchronous` class instance `function` which returns the asset id at specified `index`.

::: warning
The function might fail on some third party ERC721 contracts. If the token contract is not enumerable, this function will always return `null`.
:::

**Arguments:**

| Argument | Description
|-|-
| index | [required] A `number` representing the asset index.

**Result:**

A `number` representing the asset id.

**Example:**

```ts
// arbitrary data
const index = 0; // the contract holds 100 tokens on indexes 0 to 99

// perform query
const assetId = await ledger.getAssetIdAt(index);
```

### getBalance(accountId)

An `asynchronous` class instance `function` which returns the number of assets owned by `accountId`.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Wanchain account address.

**Result:**

An `integer` number representing the number of assets in the `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';

// perform query
const balance = await ledger.getBalance(accountId);
```

### getCapabilities()

An `asynchronous` class instance `function` which returns ledger's capabilities.

**Result:**

An `array` of `integer` numbers representing ledger capabilities.

**Example:**

```ts
// perform query
const capabilities = await ledger.getCapabilities();
```

### getInfo()

An `asynchronous` class instance `function` that returns an object with general information about the ledger.

**Result:**

| Key | Description
|-|-
| name | A `string` representing asset ledger name.
| symbol | A `string` representing asset ledger symbol.
| uriBase | A `string` representing base asset URI.
| schemaId | A `string` representing data schema ID.
| supply | A big number `string` representing the total number of issued assets.

**Example:**

```ts
// perform query
const info = await ledger.getInfo();
```

### getInstance(provider, ledgerId)

A static class `function` that returns a new instance of the AssetLedger class (alias for `new AssetLedger`).

**Arguments:**

See the class [constructor](#asset-ledger) for details.

**Example:**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
import { AssetLedger } from '@0xcert/wanchain-asset-ledger';

// arbitrary data
const provider = new HttpProvider({ url: 'https://...' });
const ledgerId = '0x...';

// create ledger instance
const ledger = AssetLedger.getInstance(provider, ledgerId);
```

### id

A class instance `variable` holding the address of ledger's smart contract on the Wanchain blockchain.

### grantAbilities(accountId, abilities)

An `asynchronous` class instance `function` which grants management permissions for this ledger to a third party `accountId`.

::: warning
The `MANAGE_ABILITIES` super ability of the ledger is required to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing an Wanchain account address or an instance of the `OrderGateway` class that will receive new management permissions on this ledger.
| abilities | [required] An array of `integers` representing this ledger's smart contract abilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { GeneralAssetLedgerAbility } from '@0xcert/wanchain-asset-ledger';

// arbitrary data
const accountId = '0x...';
const abilities = [
    GeneralAssetLedgerAbility.CREATE_ASSET,
    GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
];

// perform mutation
const mutation = await ledger.grantAbilities(accountId, abilities);
```

**See also:**

[Ledger abilities](#ledger-abilities)
[revokeAbilities](#revokeabilities-accountid-abilities)


### isApprovedAccount(assetId, accountId)

An `asynchronous` class instance `function` which returns `true` when the `accountId` has the ability to take over the `assetId`.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Wanchain account address or an instance of the `OrderGateway` class.
| assetId | [required] A `string` representing an asset ID.

**Result:**

A `boolean` which tells if the `accountId` is approved for `assetId`.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';
const assetId = '100';

// perform query
const isApproved = await ledger.isApprovedAccount(assetId, accountId);
```

**See also:**

[isApprovedOperator](#is-approved-operator), [approveAccount](#approve-account)

### isApprovedOperator(accountId, operatorId)

An `asynchronous` class instance `function` which returns `true` when the `accountId` has the ability to manage any asset of the `accountId`.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Wanchain account address that owns assets.
| operatorId | [required] A `string` representing a third-party Wanchain account address or an instance of the `OrderGateway` class.

**Result:**

A `boolean` which tells if the `operatorId` can manage assets of `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';
const operatorId = '0x...';

// perform query
const isOperator = await ledger.isApprovedOperator(accountId, operatorId);
```

**See also:**

[isApprovedAccount](#is-approved-account), [approveAccount](#approve-account)

### isTransferable()

An `asynchronous` class instance `function` which returns `true` if the asset transfer feature on this ledger is enabled.

::: warning
The `TOGGLE_TRANSFERS` ledger capability is required to perform this function.
:::

**Result:**

A `boolean` which tells if ledger asset transfers are enabled.

**Example:**

```ts
// perform query
const isTransferable = await ledger.isTransferable();
```

**See also:**

[enableTransfers](#enable-transfers)

### revokeAbilities(accountId, abilities)

An `asynchronous` class instance `function` which removes `abilities` of an `accountId`.

::: warning
The `MANAGE_ABILITIES` super ability of the ledger is required to perform this function.
:::

::: warning
You can revoke your own `MANAGE_ABILITIES` super ability.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the new Wanchain account address.
| abilities | [required] An `array` of `integer` numbers representing ledger abilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { GeneralAssetLedgerAbility } from '@0xcert/wanchain-asset-ledger';

// arbitrary data
const accountId = '0x...';
const abilities = [
    GeneralAssetLedgerAbility.CREATE_ASSET,
    GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
];

// perform mutation
const mutation = await ledger.revokeAbilities(accountId, abilities);
```

**See also:**

[Ledger abilities](#ledger-abilities)
[grantAbilities](#grantabilities-accountid-abilities)

### revokeAsset(assetId)

An `asynchronous` class instance `function` which destroys a specific `assetId` of an account. The asset is removed from the account and all queries about it will be invalid. The function is ment to be used by ledger owners to destroy assets of other accounts. This function is similar to `destroyAsset` but it differs in who can trigger it.

::: warning
The `REVOKE_ASSET` ledger capability is needed to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing the asset ID.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';

// perform mutation
const mutation = await ledger.revokeAsset(assetId);
```

**See also:**

[destroyAsset](#destroyasset-assetid)

### update(recipe)

An `asynchronous` class instance `function` which updates ledger data.

::: warning
You need `UPDATE_URI_BASE` ledger ability to update ledger's `uriBase` property.
:::

**Arguments:**

| Argument | Description
|-|-
| recipe.uriBase | [required] A `string` representing ledger URI base property.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const recipe = {
    uriBase: 'https://0xcert.com/asset/',
};

// perform mutation
const mutation = await ledger.update(recipe);
```

**See also:**

[updateAsset](#update-asset)

### updateAsset(assetId, recipe)

An `asynchronous` class instance `function` which updates `assetId` data.

::: warning
You need `UPDATE_ASSET_IMPRINT` ledger capability and `UPDATE_ASSET` ledger ability to update asset `imprint` property.
:::

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| recipe.imprint | [required] A `string` representing asset imprint property.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';
const recipe = {
    imprint: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb',
};

// perform mutation
const mutation = await ledger.updateAsset(assetId, recipe);
```

**See also:**

[update](#update)

### transferAsset(recipe)

An `asynchronous` class instance `function` which transfers asset to another account.

**Arguments:**

| Argument | Description
|-|-
| recipe.senderId | A `string` representing the account ID that will send the asset. Defaults to account that is making the mutation.
| recipe.receiverId | [required] A `string` representing the account ID that will receive the asset.
| recipe.id | [required] A `string` representing asset ID.
| recipe.data | A `string` representing some arbitrary mutation note.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const recipe = {
    receiverId: '0x...',
    id: '100',
};

// perform mutation
const mutation = await ledger.transferAsset(recipe);
```

## Ledger abilities

Ledger abilities represent account-level permissions. For optimization reasons abilities are managed as bitfields for that reason enums are values of 2**n.
We have two categories of abilities, general and super. General abilities are abilities that can not change other account's abilities whereas super abilities can.
This categorization is for safety purposes since revoking your own super ability can lead to unintentional loss of control. 

**Super abilities options:**

| Name | Value | Description
|-|-|-
| MANAGE_ABILITIES | 1 | Allows an account to further grant abilities.

**General abilities options:**

| Name | Value | Description
|-|-|-
| ALLOW_CREATE_ASSET | 32 | A specific ability that is bounded to atomic orders. When creating a new asset trough `OrderGateway`, the order maker has to have this ability.
| CREATE_ASSET | 2 | Allows an account to create a new asset.
| REVOKE_ASSET | 4 | Allows management accounts to revoke assets.
| TOGGLE_TRANSFERS | 8 | Allows an account to stop and start asset transfers.
| UPDATE_ASSET | 16 | Allows an account to update asset data.
| UPDATE_URI_BASE | 64 | Allows an account to update asset ledger's base URI.

**Example:**

```ts
import { GeneralAssetLedgerAbility } from '@0xcert/wanchain-asset-ledger';
import { SuperAssetLedgerAbility } from '@0xcert/wanchain-asset-ledger';

const abilities = [
    SuperAssetLedgerAbility.MANAGE_ABILITIES,
    GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
];
```

**See also:**

[grantAbilities](#grantabilities-accountid-abilities)
[revokeAbilities](#revokeabilities-accountid-abilities)

## Ledger capabilities

Ledger capabilities represent the features of a smart contract.

**Options:**

| Name | Value | Description
|-|-|-
| DESTROY_ASSET | 1 | Enables asset owners to destroy their assets.
| UPDATE_ASSET | 2 | Enables ledger managers to update asset data.
| REVOKE_ASSET | 4 | Enables ledger managers to revoke assets.
| TOGGLE_TRANSFERS | 3 | Enables ledger managers to start and stop asset transfers.

**Example:**

```ts
import { AssetLedgerCapability } from '@0xcert/wanchain-asset-ledger';

const capabilities = [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
];
```

## Value ledger

Value ledger represents an ERC-20 related smart contract on the Wanchain blockchain.

### ValueLedger(provider, ledgerId)

A `class` which represents a smart contract on the Wanchain blockchain.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A string representing an address of the ERC-20 related smart contract on the Wanchain blockchain.
| provider | [required] An instance of an HTTP provider.

**Example:**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
import { ValueLedger } from '@0xcert/wanchain-value-ledger';

// arbitrary data
const provider = new HttpProvider({ url: 'https://...' });
const ledgerId = '0x...';

// create ledger instance
const ledger = new ValueLedger(provider, ledgerId);
```

### approveValue(value, accountId)

An `asynchronous` class instance `function` which approves a third-party `accountId` to transfer a specific `value`. This function succeeds only when performed by the asset's owner. Multiple accounts can be approved for different values at the same time.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing an account address or an instance of the `OrderGateway` class.
| value | [required] An `integer` number representing the approved amount.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const value = '1000000000000000000'; // 1 unit (18 decimals)
const accountId = '0x...';

// perform mutation
const mutation = await ledger.approveValue(value, accountId);
```

**See also:**

[disapproveValue](#disapprove-value)

### deploy(provider, recipe)

An `asynchronous` static class `function` which deploys a new value ledger to the Wanchain blockchain.

**Arguments:**

| Argument | Description
|-|-
| provider | [required] An instance of an HTTP provider.
| recipe.name | [required] A `string` representing value ledger name.
| recipe.symbol | [required] A `string` representing value ledger symbol.
| recipe.decimals | [required] A big number `string` representing the number of decimals.
| recipe.supply | [required] A big number `string` representing the total supply of a ledger.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
import { ValueLedger } from '@0xcert/wanchain-value-ledger';

// arbitrary data
const provider = new HttpProvider({
    url: 'https://...',
    accountId: '0x...'
});
const recipe = {
    name: 'Utility token',
    symbol: 'UCC',
    decimal: '18',
    supply: '500000000000000000000', // 500 mio
};

// perform mutation
const mutation = await ValueLedger.deploy(provider, recipe).then((mutation) => {
    return mutation.complete(); // wait until first confirmation
});
```

### disapproveValue(accountId)

An `asynchronous` class instance `function` which removes the ability of a third-party account to transfer value. Note that this function succeeds only when performed by the value owner.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the accountId who will be disapproved.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';

// perform mutation
const mutation = await ledger.disapproveValue(accountId);
```

**See also:**

[approveValue](#approve-value)

### getApprovedValue(accountId, spenderId)

An `asynchronous` class instance `function` which returns the approved value that the `spenderId` is able to transfer for `accountId`.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the holder's account ID.
| spenderId | [required] A `string` representing the account ID of a spender or an instance of the `OrderGateway` class.

**Result:**

A big number `string` representing the approved value.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';
const spenderId = '0x...';

// perform query
const value = await ledger.getApprovedValue(accountId, spenderId);
```

**See also:**

[approveValue](#approve-value)

### getBalance(accountId)

An `asynchronous` class instance `function` which returns the total posessed amount of the `accountId`.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Wanchain account address.

**Result:**

A big number `string` representing the total value of the `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';

// perform query
const balance = await ledger.getBalance(accountId);
```

### getInfo()

An `asynchronous` class instance `function` that returns an object with general information about the ledger.

**Result:**

| Key | Description
|-|-
| name | A `string` representing value ledger name.
| symbol | A `string` representing value ledger symbol.
| decimals | [required] A big number of `strings` representing the number of decimals.
| supply | [required] A big number `string` representing the ledger total supply.

**Example:**

```ts
// perform query
const info = await ledger.getInfo();
```

### getInstance(provider, id)

A static class `function` that returns a new instance of the ValueLedger class (alias for `new ValueLedger`).

**Arguments**

See the class [constructor](#value-ledger) for details.

**Usage**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
import { ValueLedger } from '@0xcert/wanchain-value-ledger';

// arbitrary data
const provider = new HttpProvider({ url: 'https://...' });
const ledgerId = '0x...';

// create ledger instance
const ledger = ValueLedger.getInstance(provider, ledgerId);
```

### id

A class instance `variable` holding the address of ledger's smart contract on the Wanchain blockchain.

### isApprovedValue(value, accountId, spenderId)

An `asynchronous` class instance `function` which returns `true` when the `spenderId` has the ability to transfer the `value` from an `accountId`.

**Arguments:**

| Argument | Description
|-|-|-
| accountId | [required] A `string` representing the Wanchain account address that owns the funds.
| spenderId | [required] A `string` representing the approved Wanchain account address or an instance of the `OrderGateway` class.
| value | [required] A big number `string` representing the amount allowed to transfer.

**Result:**

A `boolean` which tells if the `spenderId` is approved to move `value` from `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0x...';
const spenderId = '0x...';
const value = '1000000000000000000';

// perform query
const isApproved = await ledger.isApprovedAccount(value, accountId, spenderId);
```

**See also:**

[approveValue](#approve-value)

### transferValue(recipe)

An `asynchronous` class instance `function` which transfers asset to another account.

**Arguments:**

| Argument | Description
|-|-
| recipe.receiverId | [required] A `string` representing account ID that will receive the value.
| recipe.senderId | A `string` representing account ID that will send the value. It defaults to provider's accountId.
| recipe.value | [required] A big number `string` representing the transferred amount.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const recipe = {
    receiverId: '0x...',
    value: '1000000000000000000', // 1 unit (18 decimals)
};

// perform mutation
const mutation = await ledger.transferValue(recipe);
```

## Orders gateway

Order gateway allows for performing multiple actions in one single atomic operation.

### OrderGateway(provider, gatewayId)

A `class` which represents a smart contract on the Wanchain blockchain.

**Arguments**

| Argument | Description
|-|-
| gatewayId | [required] A `string` representing an address of the [0xcert order gateway smart contract](#public-addresses) on the Wanchain blockchain.
| provider | [required] An instance of an HTTP provider.

**Usage**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
import { OrderGateway } from '@0xcert/wanchain-order-gateway';

// arbitrary data
const provider = new HttpProvider({ url: 'https://...' });
const gatewayId = '0x...';

// create ledger instance
const gateway = new OrderGateway(provider, gatewayId);
```

### cancel(order)

An `asynchronous` class instance `function` which marks the provided `order` as canceled. This prevents the `order` to be performed.

**Arguments:**

| Argument | Description
|-|-
| order.actions | [required] An `array` of [action objects](#order-actions).
| order.expiration | [required] An `integer` number representing the timestamp in milliseconds at which the order expires and can not be performed any more.
| order.makerId | [required] A `string` representing the Wanchain account address which makes the order. It defaults to the `accountId` of a provider.
| order.seed | [required] An `integer` number representing the unique order number.
| order.takerId | [required] A `string` representing the Wanchain account address which will be able to perform the order on the blockchain. This account also pays for the gas cost.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { OrderActionKind } from '@0xcert/wanchain-order-gateway';

// arbitrary data
const order = {
    actions: [
        {
            kind: OrderActionKind.TRANSFER_ASSET,
            ledgerId: '0x...',
            senderId: '0x...',
            receiverId: '0x...',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
    takerId: '0x...',
};

// perform mutation
const mutation = await gateway.cancel(order);
```

**See also:**

[claim](#claim), [perform](#perform)

### claim(order)

An `asynchronous` class instance `function` which cryptographically signes the provided `order` and returns a signature.

::: warning
This operation must be executed by the maker of the order.
:::

**Arguments:**

| Argument | Description
|-|-
| order.actions | [required] An `array` of [action objects](#order-actions).
| order.expiration | [required] An `integer` number representing the timestamp in milliseconds at which the order expires and can not be performed any more.
| order.makerId | [required] A `string` representing an Wanchain account address which makes the order. It defaults to the `accountId` of a provider.
| order.seed | [required] An `integer` number representing the unique order number.
| order.takerId | [required] A `string` representing the Wanchain account address which will be able to perform the order on the blockchain. This account also pays the gas cost.

**Result:**

A `string` representing order signature.

**Example:**

```ts
// arbitrary data
const order = {
    actions: [
        {
            kind: OrderActionKind.TRANSFER_ASSET,
            ledgerId: '0x...',
            senderId: '0x...',
            receiverId: '0x...',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
    takerId: '0x...',
};

// perform query
const signature = await gateway.claim(order);
```

### getInstance(provider, id)

A static class `function` that returns a new instance of the `OrderGateway` class (alias for `new OrderGateway`).

**Arguments**

See the class [constructor](#order-gateway) for details.

**Usage**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
import { OrderGateway } from '@0xcert/wanchain-order-gateway';

// arbitrary data
const provider = new HttpProvider({ url: 'https://...' });
const gatewayId = '0x...';

// create gateway instance
const gateway = OrderGateway.getInstance(provider, gatewayId);
```

### id

A class instance `variable` holding the address of gateway's smart contract on the Wanchain blockchain.

### perform(order, signature)

An `asynchronous` class instance `function` which submits the `order` with  `signature` from the maker.

::: warning
This operation must be executed by the taker of the order.
:::

**Arguments:**

| Argument | Description
|-|-
| signature | [required] A `string` representing order signature created by the maker.
| order.actions | [required] An `array` of [action objects](#order-actions).
| order.expiration | [required] An `integer` number representing the timestamp in milliseconds at which the order expires and can not be performed any more.
| order.makerId | [required] A `string` representing an Wanchain account address which makes the order. It defaults to the `accountId` of a provider.
| order.seed | [required] An `integer` number representing the unique order number.
| order.takerId | [required] A `string` representing the Wanchain account address which will be able to perform the order on the blockchain. This account also pays the gas cost.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const signature = 'fe3ea95fa6bda2001c58fd13d5c7655f83b8c8bf225b9dfa7b8c7311b8b68933';
const order = {
    actions: [
        {
            kind: OrderActionKind.TRANSFER_ASSET,
            ledgerId: '0x...',
            senderId: '0x...',
            receiverId: '0x...',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
    takerId: '0x...',
};

// perform mutation
const mutation = await gateway.perform(order, signature);
```

**See also:**

[cancel](#cancel)

## Order actions

Order actions define the atomic operations of the order gateway.

**Options:**

| Name | Value | Description
|-|-|-
| CREATE_ASSET | 1 | Create a new asset.
| TRANSFER_ASSET | 2 | Transfer an asset.
| TRANSFER_VALUE | 3 | Transfer a value.

### Create asset action

| Property | Description
|-|-|-
| assetId | [required] A `string` representing an ID of an asset.
| assetImprint | [required] A `string` representing a cryptographic imprint of an asset.
| kind | [required] An `integer` number that equals to `OrderActionKind.CREATE_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | [required] A `string` representing receiver's address.
| senderId | [required] A `string` representing sender's address.

### Transfer asset action

| Property | Description
|-|-|-
| assetId | [required] A `string` representing an ID of an asset.
| kind | [required] An `integer` number that equals to `OrderActionKind.TRANSFER_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | [required] A `string` representing receiver's address.
| senderId | [required] A `string` representing sender's address.

### Transfer value action

| Property | Description
|-|-|-
| kind | [required] An `integer` number that equals to `OrderActionKind.TRANSFER_VALUE`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | [required] A `string` representing receiver's address.
| senderId | [required] A `string` representing sender's address.
| value | [required] A big number `string` representing the transferred amount.

## Public addresses

### Mainnet

| Contract | Address
|-|-|-

Coming soon.

### Testnet

| Contract | Address
|-|-|-
| OrderGateway | [0xCbD15dFc9fb38E3283f5c122CF94eA0767b45714](http://47.104.61.26/block/addr/0xCbD15dFc9fb38E3283f5c122CF94eA0767b45714)
| TokenTransferProxy | [0xB827222B89BA5237c432c47B4ef7d2079641A075](http://47.104.61.26/block/addr/0xB827222B89BA5237c432c47B4ef7d2079641A075)
| NFTokenTransferProxy | [0xB59A801024393eB92b38a0711a54579c0136347A](http://47.104.61.26/block/addr/0xB59A801024393eB92b38a0711a54579c0136347A)
| NFTokenSafeTransferProxy | [0x84907deF46A2D0fc80035f1c08A722f2432e9801](http://47.104.61.26/block/addr/0x84907deF46A2D0fc80035f1c08A722f2432e9801)
| XcertCreateProxy | [0xB56F60874aCC5a0b0D318Bf7D15A63CA0122118D](http://47.104.61.26/block/addr/0xB56F60874aCC5a0b0D318Bf7D15A63CA0122118D)
