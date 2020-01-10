---
sidebarDepth: 2
---

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
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721-related smart contract definition file.
| options.cache | A `string` representing request cache type. It defaults to `no-cache`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.credentials | A `string` representing request credentials. It defaults to `omit`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.gasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a mutation. It defaults to `1.1`.
| options.gatewayConfig.assetLedgerDeployOrderId | A `string` representing a Wanchain address of the [asset ledger deploy gateway](/#public-addresses).
| options.gatewayConfig.actionsOrderId | A `string` representing a Wanchain address of the [actions gateway](/#public-addresses).
| options.gatewayConfig.valueLedgerDeployOrderId | A `string` representing a Wanchain address of the [value ledger deploy gateway](/#public-addresses).
| options.headers | An `object` of request headers. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mode | A `string` representing request mode. It defaults to `same-origin`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mutationTimeout | The `number` of milliseconds after which a mutation times out. Defaults to `3600000`. You can set it to `-1` to disable the timeout.
| options.redirect | A `string` representing request redirect mode. It defaults to `follow`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.retryGasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a retry action on mutation. It defaults to `2`.
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. Available options are `0` (eth_sign) or `2` (EIP-712) or `3` (personal_sign). It defaults to `0`.
| options.sandbox | A `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers.
| options.url | [required] A `string` representing the URL to the Wanchain node's JSON RPC.
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20-related smart contract definition file.
| options.verbose | A `boolean` indicating whether you are in verbose mode. Verbose mode means the console will provide more detailed information about the current state. It defaults to `false`.

**Usage**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';

const provider = new HttpProvider({
    accountId: '0x...',
    url: 'https://connection-to-wanchain-rpc-node/',
});
```

::: warning
Please note, when using [Infra](http://infra.wanchainx.exchange/), only queries are supported.
:::

### assetLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-721-related smart contract definition file. This file is used when deploying new asset ledgers to the network.

### buildGatewayConfig(networkKind)

A function that returns the current gateway config based on the deployed gateway smart contracts. Note that config will change based on release versions. If you do not want the smart contract addresses to update automatically, you should not use this function.

| Argument | Description
|-|-
| networkKind | [required] A `number` representing the Wanchain network for which we want to get the gateway config.

### gatewayConfig

A class instance `variable` holding a `GatewayConfig` which represents the configuration for `Gateway` smart contracts.

**Arguments**

| Argument | Description
|-|-
| assetLedgerDeployOrderId | A `string` representing a Wanchain address of the [asset ledger deploy gateway](/#public-addresses).
| actionsOrderId | A `string` representing a Wanchain address of the [actions gateway](/#public-addresses).
| valueLedgerDeployOrderId | A `string` representing a Wanchain address of the [value ledger deploy gateway](/#public-addresses).

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

A static class `function` which returns a new instance of the HttpProvider class (alias for `new HttpProvider`).

**Arguments**

See the class [constructor](#http-provider) for details.

**Usage**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';

// create provider instance
const provider = HttpProvider.getInstance();
```

### getNetworkVersion()

An `asynchronous` class instance `function` which returns the Wanchain network version (e.g., `1` for Wanchain Mainnet).

**Result:**

A `string` representing the Wanchain network version.

**Example:**

```ts
// perform query
const version = await provider.getNetworkVersion();
```

### isCurrentAccount(accountId)

A `synchronous` class instance `function` which returns `true` when the provided `accountId` matches the currently set account ID.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing a Wanchain account address.

**Result:**

A `boolean` which tells whether the `accountId` matches the currently set account ID.

**Example:**

```ts
// wanchain wallet address
const walletId = '0x...';

// perform query
const matches = provider.isCurrentAccount(walletId);
```

### isSupported()

A `synchronous` class instance `function` which returns `true` when the provider is supported by the environment.

**Result:**

A `boolean` which tells whether the provider can be used.

**Example:**

```ts
// perform query
const isSupported = provider.isSupported();
```

### isUnsafeRecipientId(ledgerId)

A `synchronous` class instance `function` which returns `true` when the provided `ledgerId` is listed among unsafe recipient IDs on the provider.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721-related smart contract on the Wanchain blockchain.

**Result:**

A `boolean` which tells whether the `id` is an unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const unsafeId = '0x...';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(unsafeId);
```

**See also:**

[unsafeRecipientIds](#unsaferecipientids-2)

### log(message)

A `synchronous` class instance `function` which logs message to console if verbose mode is active, otherwise it does nothing.

**Example:**

```ts
provider.log('message');
```

### mutationTimeout

A class instance `variable` holding an `integer` number of milliseconds after which a mutation times out.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID, and the second argument is the old version.

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
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID, and the second argument is the old ID.

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

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/wanchain-http-provider';

provider.off(ProviderEvent.NETWORK_CHANGE);
```

**See also:**

[on (event, handler)](#on-event-handler), [once (event, handler)](#once-event-handler)

### requiredConfirmations

A class instance `variable` holding a `string` which represents the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.

### retryGasPriceMultiplier

A class instance `variable` holding a `number` representing a multiplier of the current gas price when performing a retry action on mutation.

### sandbox

A class instance `variable` holding a `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.

### sign(message)

An `asynchronous` class instance `function` which signs a message using `signMethod` set in provider.

**Arguments:**

| Argument | Description
|-|-
| message | [required] A `string` representing the message to be signed.

**Result:**

A string representing the signature.

**Example:**

```ts
const signature = await provider.sign('test');
```

### signMethod

A class instance `variable` holding a `string` which holds a type of signature that will be used (e.g., when creating claims).

### unsafeRecipientIds

A class instance `variable` holding a `string` which represents smart contract addresses that do not support safe ERC-721 transfers.

### valueLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-20-related smart contract definition file. This file is used when deploying new value ledgers to the network.

### verbose

A class instance `variable` holding a `boolean` which represents whether you are in verbose mode. Verbose mode means the console will provide more detailed information about the current state. It defaults to `false`.

## Provider events

We can listen to different provider events. Note that not all the providers are able to emit all the events listed here.

**Options:**

| Name | Value | Description
|-|-|-
| ACCOUNT_CHANGE | accountChange | Triggered when an `accountId` is changed.
| NETWORK_CHANGE | networkChange | Triggered when the network version is changed.

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

### Mutation(provider, mutationId, context?)

A `class` which handles transaction-related operations on the Wanchain blockchain.

**Arguments**

| Argument | Description
|-|-|-
| context | An instance of `AssetLedger`, `ValueLedger` or `Gateway`. The context of a mutation informs of the kind of a mutation and will be able to parse `Logs` based on that information. If context is not provided, the logs will be left blank.
| mutationId | [required] A `string` representing a hash string of a Wanchain transaction.
| provider | [required] An instance of provider.

**Usage**

```ts
import { Mutation } from '@0xcert/wanchain-http-provider';

// arbitrary data
const mutationId = '0x...';

// create mutation instance
const mutation = new Mutation(provider, mutationId);
```

### cancel()

An `asynchronous` class instance `function` which attempts to cancel a mutation. You can only cancel a mutation that has not yet been accepted onto the blockchain. Canceling works by overwriting a pending mutation (using the same [nonce](https://kb.myetherwallet.com/en/transactions/what-is-nonce/)) with a new mutation that performs no action, which could also lead the `cancel` function to fail. The `cancel` function will throw an error if the mutation has already been accepted onto the blockchain or if you are not the originator of the mutation you want to cancel.

### complete()

An `asynchronous` class instance `function` which waits until a mutation reaches a specified number of confirmations.

::: tip
The number of required confirmations is configurable through the provider instance.
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

A class instance `variable` holding a `string` which represents a hash of a Wanchain transaction.

### isCompleted()

A `synchronous` class instance `function` which returns `true` if a mutation has reached the required number of confirmations.

**Result:**

A `boolean` telling whether the mutation has been completed.

**Example:**

```ts
mutation.isCompleted();
```

**See also:**

[isPending](#is-pending)

### isPending()

A `synchronous` class instance `function` which returns `true` when a mutation is in the process of completion.

**Result:**

A `boolean` telling whether the mutation is waiting to be confirmed.

**Example:**

```ts
mutation.isPending();
```

**See also:**

[isPending](#is-pending)

### logs

A class instance `variable` holding an `array` of logs. It only resolves if you called either `complete()` or `resolve()` function upon `Mutation` and if the `Mutation` context is set. Logs are dynamically defined and represent `Events` that were triggered by the smart contract.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [mutation event](#mutation-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ERROR`, the first argument is an `Error`, otherwise, the current `Mutation` instance is received.

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
| handler | A callback `function` which is triggered on each `event`. When the `event` equals `ERROR`, the first argument is an `Error`, otherwise, the current `Mutation` instance is received.

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

A class instance `variable` holding a `string` which represents a Wanchain account address that plays the role of a receiver.

::: tip
When you are deploying a new ledger, this variable represents the ledger ID and remains `null` until a mutation is completed.
:::

### retry()

An `asynchronous` class instance `function` which resubmits the same mutation to the blockchain at a higher price. Since the speed of accepting mutations onto the blockchain depends on the current network state, a mutation could remain unconfirmed for a while. In that case, you can retry submitting the same mutation at an increased price to speed up its acceptance onto the blockchain. The price is determined by the current network price, multiplied by the `retryGasPriceMultiplier` parameter on the provider (which defaults to `2`). Note that this method will throw an error if the mutation has already been accepted onto the blockchain.

### resolve()

An `asynchronous` class instance `function` which resolves the current mutation status.

### senderId

A class instance `variable` holding a `string` which represents a Wanchain account address that plays the role of a sender.

## Mutation events

We can listen to different mutation events that are emitted by the mutation in the process of completion.

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

Asset ledger represents ERC-721-related smart contract on the Wanchain blockchain.

### AssetLedger(provider, ledgerId)

A `class` which represents a smart contract on the Wanchain blockchain.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721-related smart contract on the Wanchain blockchain.
| provider | [required] An instance of provider.

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
Only one account per `assetId` can be approved at the same time, thus running this function multiple times will override previously set data.
:::

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| accountId | [required] A `string` representing the new owner's Wanchain account address.

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
| accountId | [required] A `string` representing a Wanchain account address that will receive new management permissions on this ledger.

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
| recipe.receiverId | [required] A `string` representing a Wanchain account address that will receive the new asset.

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
| provider | [required] An instance of provider.
| recipe.name | [required] A `string` representing asset ledger name.
| recipe.symbol | [required] A `string` representing asset ledger symbol.
| recipe.uriPrefix | [required] A `string` representing prefix of asset URI.
| recipe.uriPostfix | [required] A `string` representing postfix of asset URI.
| recipe.schemaId | [required] A `string` representing data schema ID.
| recipe.capabilities | A list of `integers` which represent ledger capabilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { HttpProvider } from '@0xcert/wanchain-http-provider';
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
    uriPrefix: 'https://example.com/assets/',
    uriPostfix: '.json',
    schemaId: '3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d', // base asset schemaId
    capabilities,
};

// perform mutation
const mutation = await AssetLedger.deploy(provider, recipe).then((mutation) => {
    return mutation.complete(); // wait until first confirmation
});
```

### destroyAsset(assetId)

An `asynchronous` class instance `function` which destroys a specific `assetId` on the Wanchain blockchain. The asset is removed from the account, and all queries about it will be invalid. The function succeeds only when performed by the asset's owner. This function is similar to `revokeAsset`, but it differs in who can trigger it.

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

An `asynchronous` class instance `function` which removes the third-party `accountId` the ability to manage assets of the account that performed this mutation.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the new Wanchain account address.

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

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Wanchain account address for which we want to get abilities.

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

An `asynchronous` class instance `function` which returns the asset ID at specified `index` for desired `accountId`.

::: warning
The function might fail on some third-party ERC-721 contracts. If the token contract is not enumerable, this function will always return `null`.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Wanchain account address.
| index | [required] A `number` representing the asset index.

**Result:**

A `number` representing the asset ID.

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

An `asynchronous` class instance `function` which returns the asset ID at specified `index`.

::: warning
The function might fail in some third-party ERC-721 contracts. If the token contract is not enumerable, this function will always return `null`.
:::

**Arguments:**

| Argument | Description
|-|-
| index | [required] A `number` representing the asset index.

**Result:**

A `number` representing the asset ID.

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

An `asynchronous` class instance `function` which returns an object with general information about the ledger.

**Result:**

| Key | Description
|-|-
| name | A `string` representing asset ledger name.
| symbol | A `string` representing asset ledger symbol.
| uriPrefix | A `string` representing prefix of asset URI.
| uriPostfix | A `string` representing postfix of asset URI.
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
| accountId | [required] A `string` representing a Wanchain account address that will receive new management permissions on this ledger.
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
| accountId | [required] A `string` representing the Wanchain account address.
| assetId | [required] A `string` representing an asset ID.

**Result:**

A `boolean` which tells whether the `accountId` is approved for `assetId`.

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
| operatorId | [required] A `string` representing a third-party Wanchain account address.

**Result:**

A `boolean` which tells whether the `operatorId` can manage assets of `accountId`.

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

A `boolean` which tells whether ledger asset transfers are enabled.

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

An `asynchronous` class instance `function` which destroys a specific `assetId` of an account. The asset is removed from the account and all queries about it will be invalid. The function is meant to be used by ledger owners to destroy assets of other accounts. This function is similar to `destroyAsset`, but it differs in who can trigger it.

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

### setAbilities(accountId, abilities)

An `asynchronous` class instance `function` which sets `abilities` of an `accountId`.

::: warning
The `MANAGE_ABILITIES` super ability of the ledger is required to perform this function.
:::

::: warning
You can override your own `MANAGE_ABILITIES` super ability.
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
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const abilities = [
    GeneralAssetLedgerAbility.CREATE_ASSET,
    GeneralAssetLedgerAbility.TOGGLE_TRANSFERS,
];

// perform mutation
const mutation = await ledger.setAbilities(accountId, abilities);
```

**See also:**

[Ledger abilities](#ledger-abilities)
[grantAbilities](#grantabilities-accountid-abilities)
[revokeAbilities](#revokeabilities-accountid-abilities)

### update(recipe)

An `asynchronous` class instance `function` which updates ledger data.

::: warning
You need `UPDATE_URI` ledger ability to update ledger's `uriPrefix` and `uriPostfix` properties.
:::

**Arguments:**

| Argument | Description
|-|-
| recipe.uriPrefix | [required] A `string` representing ledger URI uriPrefix property.
| recipe.uriPostfix | [required] A `string` representing ledger URI uriPostfix property.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const recipe = {
    uriPrefix: 'https://example.com/',
    uriPostfix: '.json',
};

// perform mutation
const mutation = await ledger.update(recipe);
```

**See also:**

[updateAsset](#update-asset)

### updateAsset(assetId, recipe)

An `asynchronous` class instance `function` which updates `assetId` data.

::: warning
You need the `UPDATE_ASSET_IMPRINT` ledger capability and the `UPDATE_ASSET` ledger ability to update the asset `imprint` property.
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

An `asynchronous` class instance `function` which transfers an asset to another account.

**Arguments:**

| Argument | Description
|-|-
| recipe.senderId | A `string` representing the account ID that will send the asset. Defaults to the account that is making the mutation.
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

Ledger abilities represent account-level permissions. For optimization reasons, the abilities are managed as bitfields, and for that reason, enums are values of 2^n.
There are two categories of abilities, general and super. General abilities are abilities that can not change other account's abilities, whereas super abilities can.
This categorization is for safety purposes since revoking your own super ability can lead to unintentional loss of control.

**Super abilities options:**

| Name | Value | Description
|-|-|-
| MANAGE_ABILITIES | 1 | Allows an account to further grant abilities.
| ALLOW_MANAGE_ABILITIES | 2 | A specific ability that is bound to atomic orders. When granting or revoking abilities through `Gateway`, the order maker has to have this ability.

**General abilities options:**

| Name | Value | Description
|-|-|-
| ALLOW_CREATE_ASSET | 512 | A specific ability that is bound to atomic orders. When creating a new asset through `Gateway`, the order maker has to have this ability.
| ALLOW_UPDATE_ASSET_IMPRINT | 1024 | A specific ability that is bound to atomic orders. When updating asset imprint through `Gateway`, the order maker has to have this ability.
| CREATE_ASSET | 16 | Allows an account to create a new asset.
| REVOKE_ASSET | 32 | Allows management accounts to revoke assets.
| TOGGLE_TRANSFERS | 64 | Allows an account to stop and start asset transfers.
| UPDATE_ASSET | 128 | Allows an account to update asset data.
| UPDATE_URI | 256 | Allows an account to update asset ledger's URI prefix and postfix.

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

Value ledger represents an ERC-20-related smart contract on the Wanchain blockchain.

### ValueLedger(provider, ledgerId)

A `class` which represents a smart contract on the Wanchain blockchain.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A string representing an address of the ERC-20-related smart contract on the Wanchain blockchain.
| provider | [required] An instance of provider.

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
| accountId | [required] A `string` representing an account address.
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
| provider | [required] An instance of provider.
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
| accountId | [required] A `string` representing the accountId which will be disapproved.

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
| spenderId | [required] A `string` representing the spender's account ID.

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

An `asynchronous` class instance `function` which returns the total possessed amount of the `accountId`.

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
| spenderId | [required] A `string` representing the approved Wanchain account address.
| value | [required] A big number `string` representing the amount allowed to transfer.

**Result:**

A `boolean` which tells whether the `spenderId` is approved to move `value` from `accountId`.

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

An `asynchronous` class instance `function` which transfers an asset to another account.

**Arguments:**

| Argument | Description
|-|-
| recipe.receiverId | [required] A `string` representing account ID that will receive the value.
| recipe.senderId | A `string` representing account ID that will send the value. It defaults to the provider's accountId.
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

## Gateway

The Gateway allows for performing multiple actions in a single atomic swap. The gateway always operates with an order.
There are different kinds of order, depending on the type of action you want to perform. We can separate orders into two groups
based on their functionality and their flow. First, there are orders for deploying a new `ValueLedger` and `AssetLedger`. 
These two orders only perform the deployment of a new smart contract to the blockchain plus a transfer of ERC-20 tokens (value). 
They are primarily targeted to delegating a deployment to a third party. For example, if you want to deploy a new `AssetLedger`
but you do not want to do that yourself, you can pay someone some ERC-20 tokens to perform that for you. These two orders have the following flow:

1. Maker (address creating an order) defines the order (defines who will be the owner of the newly deployed ledger, who will receive tokens, etc.).
2. Maker generates the order claim and signs it (`sign` function).
3. Maker approves value transfer if necessary.
4. Maker sends the order and signature to the taker (through arbitrary ways).
5. Taker performs the order.

In this case, the taker can also be defined as "anyone", meaning you can define an order saying basically, "I am willing to pay X tokens to anyone willing to create this ledger for me".

Order kinds that fit into this group are:
- `DeployAssetLedgerOrder`
- `DeployValueLedgerOrder` 

Then, there are orders for performing actions on existing ledgers. These orders are really powerful, but this makes them more complicated, too.
Unlike deploy orders that have a specific maker and taker, the actions order are more dynamic, allowing an X number of participants to join but who need to sign an order for it to be valid.
That also means that we can have multiple participants performing actions in a single atomic order. Actions that can be performed are the following:
- Transfer asset
- Transfer value
- Create new asset
- Update existing asset imprint
- Destroy an asset
- Update account abilities

Since we have multiple participants in an order, there are four different ways to interact with it, resulting in four `ActionsOrder`s differentiating only in the way participants interact with it, namely:
- `FixedActionsOrder` - All participants are known and set in the order. Only the last defined participant can peform the order, other participants have to provide signatures.
- `SignedFixedActionsOrder` - All participants are known and set in the order. All participants have to provide signatures. Any participant can perform the order.
- `DynamicActionsOrder` - The last participant can be unknown or "any". All defined participants have to provide signatures. Any participant can peform the order and automatically becomes the last participant.
- `SignedDynamicActionsOrder` - The last participant can be unknown or "any". All defined participants have to provide signatures, the last or "any" participant, as well. Any participant can perform the order.

Let's illustrate the above concepts through an example. Let's say we want to sell two CryptoKitties for 5.000 ZXC. To allow anyone to buy it, we would use a `DynamicActionsOrder`, since we do not need to set the `receiverId` of the CryptoKitties and neither the `senderId` of ZXC. This means that anyone that wants to perform the order will automatically become the empty recipient/sender with whom we will exchange the assets. If we use the same case, but this time, we want to sell our CryptoKitties to Bob for 5.000 ZXC, we will use `FixedActionsOrder`, so that we can specify the exact receiver. Now, let's say that Bob does not have any ETH and is unable to perform the order, but he has tons of ZXC tokens, and his friend Sara is willing to help him out. In this case, we can use a `SignedFixedActionsOrder`, so that Bob only needs to sign the order, and Sara can perform it. If he wanted to pay Sara some ZXC for doing this, he could specify this in the order.

Therefore, `signed` orders are perfect for third-party services providing order execution for someone else. This can come handy in a variety of dApps.

::: warning
When using dynamic order, you cannot send any of the assets to the zero address (0x000...0), since the zero address is reserved for replacing the order taker in the smart contract.
:::

### Gateway(provider, gatewayConfig?)

A `class` representing a smart contract on the Wanchain blockchain.

**Arguments**

| Argument | Description
|-|-
| gatewayConfig.assetLedgerDeployOrderId | A `string` representing a Wanchain address of the [asset ledger deploy gateway](/#public-addresses).
| gatewayConfig.actionsOrderId | A `string` representing a Wanchain address of the [actions gateway](/#public-addresses).
| gatewayConfig.valueLedgerDeployOrderId | A `string` representing a Wanchain address of the [value ledger deploy gateway](/#public-addresses).
| provider | [required] An instance of provider.

**Usage**

```ts
import { HttpProvider, buildGatewayConfig } from '@0xcert/ethereum-http-provider';
import { Gateway } from '@0xcert/ethereum-gateway';

// arbitrary data
const provider = new HttpProvider();

// create ledger instance
const gateway = new Gateway(provider, buildGatewayConfig(NetworkType.ROPSTEN));
```

### cancel(order)

An `asynchronous` class instance `function` which marks the provided `order` as canceled. It prevents the `order` from being performed.

**Arguments:**

| Argument | Description
|-|-
| order | [required] An [`Order` object](#order-kinds).

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { ActionsOrderActionKind } from '@0xcert/ethereum-gateway';

// arbitrary data
const order = {
    kind: OrderKind.FixedActionsOrder,
    signers: ['0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce', '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce'],
    actions: [
        {
            kind: ActionsOrderActionKind.TRANSFER_ASSET,
            ledgerId: '0xcc377f78e8821fb8d19f7e6240f44553ce3dbfce',
            senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
};

// perform mutation
const mutation = await gateway.cancel(order);
```

**See also:**

[claim](#sign), [perform](#perform)

### config

A class instance `variable` holding the configuration of gateway smart contracts.

### getInstance(provider, gatewayConfig?)

A static class `function` that returns a new instance of the `Gateway` class (alias for `new Gateway`).

**Arguments**

See the class [constructor](#gateway) for details.

**Usage**

```ts
import { HttpProvider, buildGatewayConfig } from '@0xcert/ethereum-http-provider';
import { Gateway } from '@0xcert/ethereum-gateway';

// arbitrary data
const provider = new HttpProvider();

// create gateway instance
const gateway = Gateway.getInstance(provider, buildGatewayConfig(NetworkType.ROPSTEN));
```

## getProxyAccountId(proxyKind, ledgerId?)

An `asynchronous` class instance `function` which gets the accountId of a desired proxy from the gateway smart contract infrastructure.

**Arguments:**

| Argument | Description
|-|-
| proxyKind | [required] A `ProxyKind` option.

**Result:**

A `string` representing proxy accountId.

**Example:**

```ts
// perform query
const proxyAccountId = await gateway.getProxyAccountId(ProxyKind.CREATE_ASSET);
```

### hash(order)

An `asynchronous` class instance `function` which returns a hash of the provided `order`.

**Arguments:**

| Argument | Description
|-|-
| order | [required] An [`Order` object](#order-kinds).

**Result:**

A `string` representing order hash.

**Example:**

```ts
// arbitrary data
const order = {
    kind: OrderKind.FixedActionsOrder,
    signers: ['0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce', '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce'],
    actions: [
        {
            kind: ActionsOrderActionKind.TRANSFER_ASSET,
            ledgerId: '0xcc377f78e8821fb8d19f7e6240f44553ce3dbfce',
            senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
};

// perform query
const hash = await gateway.hash(order);
```

### perform(order, signature)

An `asynchronous` class instance `function` which submits the `order` with a `signature`. 

::: warning
The executor of this operation varies depending on the `OrderKind`.
:::

**Arguments:**

| Argument | Description
|-|-
| signature | [required] A `string` or `string[]` representing order signatures.
| order | [required] An [`Order` object](#order-kinds).

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const order = {
    kind: OrderKind.FixedActionsOrder,
    signers: ['0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce', '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce'],
    actions: [
        {
            kind: ActionsOrderActionKind.TRANSFER_ASSET,
            ledgerId: '0xcc377f78e8821fb8d19f7e6240f44553ce3dbfce',
            senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
};

// perform mutation
const mutation = await gateway.perform(order, signature);
```

**See also:**

[cancel](#cancel)

### sign(order)

An `asynchronous` class instance `function` which cryptographically signs the provided `order` and returns a signature.

::: warning
This operation must be executed by the maker or one of the signers of the order.
:::

**Arguments:**

| Argument | Description
|-|-
| order | [required] An [`Order` object](#order-kinds).

**Result:**

A `string` representing order signature.

**Example:**

```ts
// arbitrary data
const order = {
    kind: OrderKind.FixedActionsOrder,
    signers: ['0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce', '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce'],
    actions: [
        {
            kind: ActionsOrderActionKind.TRANSFER_ASSET,
            ledgerId: '0xcc377f78e8821fb8d19f7e6240f44553ce3dbfce',
            senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
};

// perform query
const signature = await gateway.sign(order);
```

## Order kinds

Orders define what an atomic swap will do. There are three different order kinds with different use cases and definitions.

### Asset ledger deploy order

This order kind is used for delegating `AssetLedger` deploy.

| Argument | Description
|-|-
| assetLedgerData.capabilities | [required] A list of `integers` representing ledger capabilities.
| assetLedgerData.name | [required] A `string` representing asset ledger name.
| assetLedgerData.owner | [required] A `string` representing the Wanchain wallet, which will be the owner of the asset ledger.
| assetLedgerData.schemaId | [required] A `string` representing data schema ID.
| assetLedgerData.symbol | [required] A `string` representing asset ledger symbol.
| assetLedgerData.uriPrefix | [required] A `string` representing prefix of asset URI.
| assetLedgerData.uriPostfix | [required] A `string` representing postfix of asset URI.
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed anymore.
| kind | [required] An `integer` number that equals to `OrderKind.ASSET_LEDGER_DEPLOY_ORDER`.
| makerId | [required] A `string` representing a Wanchain account address which makes the order. It defaults to the `accountId` of a provider.
| seed | [required] An `integer` number representing a unique order number.
| takerId | A `string` representing the Wanchain account address which will be able to perform the order on the blockchain. This account also pays the gas cost.
| tokenTransferData.ledgerId | [required] A `string` representing asset ledger address.
| tokenTransferData.receiverId | A `string` representing the receiver's address.
| tokenTransferData.value | [required] A big number `string` representing the transferred amount.

### DynamicActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities, and destroying assets.
All participants (signers) except for the last one are defined. This means that any participant with the order and signatures from other participants can perform the order and, by doing so, becomes the last "unknown" participant.

| Argument | Description
|-|-
| actions | [required] An `array` of [dynamic actions order action objects](#actions order-actions).
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.DYNAMIC_ACTIONS_ORDER`.
| seed | [required] An `integer` number representing a unique order number.
| signers | [required] A `string[]` representing order signers.

### FixedActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities, and destroying assets.
All participants (signers) have to be known beforehand, and the last defined signer can peform the order (the last signer's signature is not needed since he is the one performing the order).

| Argument | Description
|-|-
| actions | [required] An `array` of [fixed actions order action objects](#actions order-actions).
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.FIXED_ACTIONS_ORDER`.
| seed | [required] An `integer` number representing a unique order number.
| signers | [required] A `string[]` representing order signers.

### SignedDynamicActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities, and destroying assets.
All participants (signers) except for the last one are defined. This means that any participant can provide the last signature and, by doing so, becomes the last participant. Any participant with all the signatures is able to perform the order.

| Argument | Description
|-|-
| actions | [required] An `array` of [dynamic actions order action objects](#actions order-actions).
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER`.
| seed | [required] An `integer` number representing a unique order number.
| signers | [required] A `string[]` representing order signers.

### SignedFixedActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities, and destroying assets.
All participants (signers) have to be known beforehand, and any participant with all signatures provided can perform the order.

| Argument | Description
|-|-
| actions | [required] An `array` of [fixed actions order action objects](#actions order-actions).
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.SIGNED_FIXED_ACTIONS_ORDER`.
| seed | [required] An `integer` number representing a unique order number.
| signers | [required] A `string[]` representing order signers.

### Value ledger deploy order

This order kind is used for delegating `ValueLedger` deploy.

| Argument | Description
|-|-
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.ASSET_LEDGER_DEPLOY_ORDER`.
| makerId | [required] A `string` representing a Wanchain account address which makes the order. It defaults to the `accountId` of a provider.
| seed | [required] An `integer` number representing a unique order number.
| takerId | A `string` representing the Wanchain account address which will be able to perform the order on the blockchain. This account also pays the gas cost.
| tokenTransferData.ledgerId | [required] A `string` representing asset ledger address.
| tokenTransferData.receiverId | A `string` representing the receiver's address.
| tokenTransferData.value | [required] A big number `string` representing the transferred amount.
| valueLedgerData.decimals | [required] A big number `string` representing the number of decimals.
| valueLedgerData.name | [required] A `string` representing value ledger name.
| valueLedgerData.owner | [required] A `string` representing the Ethereum wallet that will be the owner of the asset ledger.
| valueLedgerData.supply | [required] A big number `string` representing the total supply of a ledger.
| valueLedgerData.symbol | [required] A `string` representing value ledger symbol.

## ActionsOrder actions

ActionsOrder actions define the atomic operations of the actions order.

**Options:**

| Name | Value | Description
|-|-|-
| CREATE_ASSET | 1 | Create a new asset.
| DESTROY_ASSET | 6 | Destroy an asset.
| UPDATE_ASSET_IMPRINT | 4 | Update asset imprint.
| SET_ABILITIES | 5 | Set abilities.
| TRANSFER_ASSET | 2 | Transfer an asset.
| TRANSFER_VALUE | 3 | Transfer a value.

::: warning
There is a possibility of unintentional behavior where asset imprint can be overwritten if more than one `UPDATE_ASSET_IMPRINT` order per asset is active. Be aware of this when implementing.
:::

::: warning
There is a possibility of unintentional behavior where account abilities could be overwritten if more than one `SET_ABILITIES` action per account is active. Be aware of this when implementing.
:::

### DynamicActionsOrderActionCreateAsset

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| assetImprint | [required] A `string` representing a cryptographic imprint of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.CREATE_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's address.
| senderId | A `string` representing the sender's address.

### DynamicActionsOrderActionDestroyAsset

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.DESTROY_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| senderId | A `string` representing the sender's address.

### DynamicActionsOrderActionSetAbilities

| Property | Description
|-|-
| abilities[] | [required] An array of `AssetLedgerAbility` representing abilities of an account.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.SET_ABILITIES`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's (account of which we are setting abilities) address.
| senderId | A `string` representing the sender's address.

### DynamicActionsOrderActionUpdateAssetImprint

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| assetImprint | [required] A `string` representing a cryptographic imprint of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.UPDATE_ASSET_IMPRINT`.
| ledgerId | [required] A `string` representing asset ledger address.
| senderId | A `string` representing the sender's address.

### DynamicActionsOrderActionTransferAsset

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.TRANSFER_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's address.
| senderId | A `string` representing the sender's address.

### DynamicActionsOrderActionTransferValue

| Property | Description
|-|-
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.TRANSFER_VALUE`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's address.
| senderId | A `string` representing the sender's address.
| value | [required] A big number `string` representing the transferred amount.

### FixedActionsOrderActionCreateAsset

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| assetImprint | [required] A `string` representing a cryptographic imprint of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.CREATE_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | [required] A `string` representing the receiver's address.
| senderId | [required] A `string` representing the sender's address.

### FixedActionsOrderActionDestroyAsset

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.DESTROY_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| senderId | [required] A `string` representing the sender's address.

### FixedActionsOrderActionSetAbilities

| Property | Description
|-|-
| abilities[] | [required] An array of `AssetLedgerAbility` representing abilities of an account.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.SET_ABILITIES`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | [required] A `string` representing the receiver's (account of which we are setting abilities) address.
| senderId | [required] A `string` representing the sender's address.

### FixedActionsOrderActionUpdateAssetImprint

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| assetImprint | [required] A `string` representing a cryptographic imprint of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.UPDATE_ASSET_IMPRINT`.
| ledgerId | [required] A `string` representing asset ledger address.
| senderId | [required] A `string` representing the sender's address.

### FixedActionsOrderActionTransferAsset

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.TRANSFER_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | [required] A `string` representing the receiver's address.
| senderId | [required] A `string` representing the sender's address.

### FixedActionsOrderActionTransferValue

| Property | Description
|-|-
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.TRANSFER_VALUE`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | [required] A `string` representing the receiver's address.
| senderId | [required] A `string` representing the sender's address.
| value | [required] A big number `string` representing the transferred amount.

## Public addresses

These are the latest addresses that work with the 0xcert Framework version 2.0.0. For older addresses, check [Documentation v1]().

### Mainnet

| Contract | Address
|-|-
| AbilitableManageProxy | []()
| ActionsGateway | []()
| NFTokenTransferProxy | []()
| NFTokenSafeTransferProxy | []()
| TokenDeployGateway | []()
| TokenTransferProxy | []()
| XcertCreateProxy | []()
| XcertDeployGateway | []()
| XcertDestroyProxy | []()
| XcertUpdateProxy | []()

### Testnet

| Contract | Address
|-|-
| AbilitableManageProxy | []()
| ActionsGateway | []()
| NFTokenTransferProxy | []()
| NFTokenSafeTransferProxy | []()
| TokenDeployGateway | []()
| TokenTransferProxy | []()
| XcertCreateProxy | []()
| XcertDeployGateway | []()
| XcertDestroyProxy | []()
| XcertUpdateProxy | []()
