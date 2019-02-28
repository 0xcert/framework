# API / Ethereum

## MetaMask provider

A MetaMask provider is applied for in-browser use. The user should have the [MetaMask](https://metamask.io/) installed. The provider automatically establishes a communication channel to MetaMask which further performs communication with the Ethereum blockchain.

### MetamaskProvider(options)

A `class` providing the communication with the Ethereum blockchain through [MetaMask](https://metamask.io/).

**Arguments**

| Argument | Description
|-|-|-
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.
| options.mutationTimeout | A `number` representing the number of milliseconds in which a mutation times out.
| options.orderGatewayId | A `string` representing an Ethereum address of the [order gateway](/#public-addresses).
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. The available options are `0` (eth_sign) or `2` (EIP-712). It defaults to `0`.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers (e.g. CryptoKitties address should be listed here). 
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

**Usage**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';

const provider = new MetamaskProvider();
```

**See also:**

[HttpProvider](#http-provider)

### accountId

A class instance `variable` holding a `string` which represents user's current Ethereum wallet address.

### assetLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.

### emit(event, ...options);

A `synchronous` class instance `function` to manually trigger a provider event.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| options | [required] Pass a valid account ID for `ACCOUNT_CHANGE` event and a valid network version for `NETWORK_CHANGE` event.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { AccountEvent } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

mutation.emit(AccountEvent.NETWORK_CHANGE, '3');
```

### enable()

An `asynchronous` class instance `function` which authorizes the provider and connects it with the website.

**Example:**

```ts
// perform mutation
const provider = await provider.enable();
```

### getInstance(options)

A static class `function` that returns a new instance of the MetamaskProvider class (alias for `new MetamaskProvider`).

**Arguments**

See the class [constructor](#metamask-provider) for details.

**Usage**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';

// create provider instance
const provider = MetamaskProvider.getInstance();
```

### getNetworkVersion()

An `asynchronous` class instance `function` which returns Ethereum network version (e.g. `1` for Ethereum Mainnet).

**Result:**

A `string` representing Ethereum network version.

**Example:**

```ts
// perform query
const version = await provider.getNetworkVersion();
```

### isEnabled()

A `asynchronous` class instance `function` which returns `true` when the provider is authorized by the website.

**Result:**

A `boolean` which tells if provider is enabled.

**Example:**

```ts
// perform query
const isEnabled = await provider.isEnabled();
```

**See also:**

[enable](#enable), [isSupported](#is-supported)

### isSupported()

A `synchronous` class instance `function` which returns `true` when the provider is supported by the environment.

**Result:**

A `boolean` which tells if the provider can be used.

**Example:**

```ts
// perform query
const isSupported = provider.isSupported();
```

**See also:**

[isEnabled](#is-enabled)

### isUnsafeRecipientId(ledgerId)

A `synchronous` class instance `function` which returns `true` when the provided `id` is listed among unsafe recipient ids on the provided.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum blockchain.

**Result:**

A `boolean` which tells if the `id` is unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const criptoKittiesId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(criptoKittiesId);
```

**See also:**

[unsafeRecipientIds](#unsaferecipientids)

### mutationTimeout

A class instance `variable` holding an `integer` number of milliseconds in which a mutation times out.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID, when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

provider.on(ProviderEvent.NETWORK_CHANGE, (networkVersion) => {
  console.log('Network has changed', networkVersion);
});
```

**See also:**

[once (event, handler)](#once-event-handler), [off (event, handler)](#off-event-handler)

### once(event, handler);

A `synchronous` class instance `function` which attaches a new event handler. The event is automatically removed once the first `event` is emitted.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID, when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-metamask-provider';

provider.on(ProviderEvent.NETWORK_CHANGE, (networkVersion) => {
  console.log('Network has changed', networkVersion);
});
```

**See also:**

[on (event, handler)](#on-event-handler), [off (event, handler)](#off-event-handler)

### off(event, handler)

A `synchronous` class instance `function` which removes an existing event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | A specific callback `function` of an event. If not provided, all handlers of the `event` are removed.

**Result:**

An instance of the same provider  class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-metamask-provider';

provider.off(ProviderEvent.NETWORK_CHANGE);
```

**See also:**

[on (event, handler)](#on-event-handler), [once (event, handler)](#once-event-handler)

### orderGatewayId

A class instance `variable` holding a `string` which represents an Ethereum address of the [order gateway](/#public-addresses).

### requiredConfirmations

A class instance `variable` holding a `string` which represents the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.

### signMethod

A class instance `variable` holding a `string` which holds a type of signature that will be used (e.g. when creating claims).

### unsafeRecipientIds

A class instance `variable` holding a `string` which represents smart contract addresses that do not support safe ERC-721 transfers.

### valueLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

## HTTP provider

HTTP provider uses HTTP and HTTPS protocol for communication with the Ethereum node. It is used mostly for querying and mutating data but does not support subscriptions.

::: warning
Don't forget to manually unlock your account before performing a mutation.
:::

### HttpProvider(options)

A `class` providing communication with the Ethereum blockchain using the HTTP/HTTPS protocol.

**Arguments**

| Argument | Description
|-|-
| options.accountId | [required] A `string` representing the Ethereum account that will perform actions.
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file.
| options.cache | A `string` representing request cache type. It defaults to `no-cache`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.credentials | A `string` representing request credentials. It defaults to `omit`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.headers | An `object` of request headers. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mode | A `string` representing request mode. It defaults to `same-origin`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mutationTimeout | A `number` representing the number of milliseconds in which a mutation times out.
| options.orderGatewayId | A `string` representing an Ethereum address of the [order gateway](/#public-addresses).
| options.redirect | A `string` representing request redirect mode. It defaults to `follow`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.requiredConfirmations | An `integer` represeting the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. The available options are `0` (eth_sign) or `2` (EIP-712). It defaults to `0`.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers.
| options.url | [required] A `string` representing the URL to the Ethereum node's JSON RPC.
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file.

**Usage**

```ts
import { HttpProvider } from '@0xcert/ethereum-http-provider';

const provider = new HttpProvider({
    accountId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
    url: 'https://connection-to-ethereum-rpc-node/',
});
```

::: warning
Please note, when using [Infura](https://infura.io/), only queries are supported.
:::

**See also:**

[MetamaskProvider](#metamask-provider)

### assetLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.

### getInstance(options)

A static class `function` that returns a new instance of the HttpProvider class (alias for `new HttpProvider`).

**Arguments**

See the class [constructor](#http-provider) for details.

**Usage**

```ts
import { HttpProvider } from '@0xcert/ethereum-http-provider';

// create provider instance
const provider = HttpProvider.getInstance();
```

### getNetworkVersion()

An `asynchronous` class instance `function` which returns Ethereum network version (e.g. `1` for Ethereum Mainnet).

**Result:**

A `string` representing Ethereum network version.

**Example:**

```ts
// perform query
const version = await provider.getNetworkVersion();
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

A `synchronous` class instance `function` which returns `true` when the provided `id` is listed among unsafe recipient ids on the provided.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum blockchain.

**Result:**

A `boolean` which tells if the `id` is unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const criptoKittiesId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(criptoKittiesId);
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
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-http-provider';

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
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-http-provider';

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
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | A specific callback `function` of an event. If not provided, all handlers of the `event` are removed.

**Result:**

An instance of the same provider  class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-http-provider';

provider.off(ProviderEvent.NETWORK_CHANGE);
```

**See also:**

[on (event, handler)](#on-event-handler), [once (event, handler)](#once-event-handler)

### orderGatewayId

A class instance `variable` holding a `string` which represents an Ethereum address of the [order gateway](/#public-addresses).

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

The 0xcert Framework performs mutations for any request that changes the state on the Ethereum blockchain.

### Mutation(provider, mutationId)

A `class` which handles transaction-related operations on the Ethereum blockchain.

**Arguments**

| Argument | Description
|-|-|-
| mutationId | [required] A `string` representing a hash string of an Ethereum transaction.
| provider | [required] An instance of an HTTP or MetaMask provider.

**Usage**

```ts
import { Mutation } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

// arbitrary data
const mutationId = '0x767857798ea7c8d21ad72c4d7e054ed45ab5d177c06baa2183dbfc3b61926963';

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
| event | [required] A `string` representing a [mutation event](./ethereum.md#mutation-events) name.
| options | For `ERROR` event, an instance of an `Error` must be provided.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

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

A class instance `variable` holding a `string` which represents a hash of an Ethereum transaction.

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
| event | [required] A `string` representing a [mutation event](./ethereum.md#mutation-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ERROR`, the first argument is an `Error`, otherwise the current `Mutation` instance is received.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

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
| event | [required] A `string` representing a [mutation event](./ethereum.md#mutation-events) name.
| handler | A callback `function` which is triggered on each `event`. When the `event` equals `ERROR`, the first argument is an `Error`, otherwise the current `Mutation` instance is received.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

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
| event | [required] A `string` representing a [mutation event](./ethereum.md#mutation-events) name.
| handler | A specific callback `function` of an event. If not provided, all handlers of the `event` are removed.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MutationEvent } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

mutation.off(MutationEvent.ERROR);
```

**See also:**

[on (event, handler)](#on-event-handler), [once (event, handler)](#once-event-handler)

### receiverId

A class instance `variable` holding a `string` which represents an Ethereum account address that plays the role of a receiver.

::: tip
When you are deploying a new ledger, this variable represents the ledger ID and is `null` until a mutation is completed.
:::

### senderId

A class instance `variable` holding a `string` which represents an Ethereum account address that plays the role of a sender.

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

Asset ledger represents ERC-721 related smart contract on the Ethereum blockchain.

### AssetLedger(provider, ledgerId)

A `class` which represents a smart contract on the Ethereum blockchain.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum blockchain.
| provider | [required] An instance of an HTTP or MetaMask provider.

**Example:**

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

An `asynchronous` class instance `function` which approves a third-party `accountId` to take over a specific `assetId`. This function succeeds only when performed by the asset's owner.

::: tip
Only one account per `assetId` can be approved at the same time thus running this function multiple times will override previously set data.
:::

**Arguments:**

| Argument | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| accountId | [required] A `string` representing the new owner's Ethereum account address or an instance of the `OrderGateway` class.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
| accountId | [required] A `string` representing an Ethereum account address or an instance of the `OrderGateway` class that will receive new management permissions on this ledger.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const assetId = '100';
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// perform mutation
const mutation = await ledger.approveOperator(accountId);
```

**See also:**

[disapproveOperator](#disapprove-operator), [approveAccount](#approve-account)

### createAsset(recipe)

An `asynchronous` class instance `function` which creates a new asset on the Ethereum blockchain.

::: warning
The `CREATE_ASSET` ledger ability is needed to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| recipe.id | [required] A `string` representing a unique asset ID.
| recipe.imprint | [required] A `string` representing asset imprint generated by using `Cert` class.
| recipe.receiverId | [required] A `string` representing an Ethereum account address that will receive the new asset.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const asset = {
    id: '100',
    imprint: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb',
    receiverId: '0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa',
};

// perform mutation
const mutation = await ledger.createAsset(asset);
```

**See also:**

[Cert](#cert)

### deploy(provider, recipe)

An `asynchronous` static class `function` which deploys a new asset ledger to the Ethereum blockchain.

::: tip
All ledger abilities are automatically granted to the account that performs this method.
:::

**Arguments:**

| Argument | Description
|-|-
| provider | [required] An instance of an HTTP or MetaMask provider.
| recipe.name | [required] A `string` representing asset ledger name.
| recipe.symbol | [required] A `string` representing asset ledger symbol.
| recipe.uriBase | [required] A `string` representing base asset URI.
| recipe.schemaId | [required] A `string` representing data schema ID.
| recipe.capabilities | A list of `integers` which represent ledger capabilities.

**Result:**

An instance of the same mutation class.

**Example:**

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
    schemaId: '0x3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d', // base asset schemaId
    capabilities,
};

// perform mutation
const mutation = await AssetLedger.deploy(provider, recipe).then((mutation) => {
    return mutation.complete(); // wait until first confirmation
});
```

### destroyAsset(assetId)

An `asynchronous` class instance `function` which destroys a specific `assetId` on the Ethereum blockchain. The asset is removed from the account but stays logged in the blockchain. The function succeeds only when performed by the asset's owner.

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

[revokeAsset](#revoke-asset)

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
| accountId | [required] A `string` representing the new Ethereum account address or an instance of the `OrderGateway` class.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
| accountId | [required] A `string` representing the Ethereum account address.
| index | [required] A `number` representing the asset index.

**Result:**

A `number` representing the asset id.

**Example:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
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
| accountId | [required] A `string` representing the Ethereum account address.

**Result:**

An `integer` number representing the number of assets in the `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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

### grantAbilities(accountId, abilities)

An `asynchronous` class instance `function` which grants management permissions for this ledger to a third party `accountId`.

::: warning
The `MANAGE_ABILITIES` ledger ability is required to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing an Ethereum account address or an instance of the `OrderGateway` class that will receive new management permissions on this ledger.
| abilities | [required] An array of `integers` representing this ledger's smart contract abilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { AssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const abilities = [
    AssetLedgerAbility.CREATE_ASSET,
    AssetLedgerAbility.TOGGLE_TRANSFERS,
];

// perform mutation
const mutation = await ledger.grantAbilities(accountId, abilities);
```

**See also:**

[revokeAbilities](#revoke-abilities)


### isApprovedAccount(assetId, accountId)

An `asynchronous` class instance `function` which returns `true` when the `accountId` has the ability to take over the `assetId`.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Ethereum account address or an instance of the `OrderGateway` class.
| assetId | [required] A `string` representing an asset ID.

**Result:**

A `boolean` which tells if the `accountId` is approved for `assetId`.

**Example:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
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
| accountId | [required] A `string` representing the Ethereum account address that owns assets.
| operatorId | [required] A `string` representing a third-party Ethereum account address or an instance of the `OrderGateway` class.

**Result:**

A `boolean` which tells if the `operatorId` can manage assets of `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const operatorId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
The `MANAGE_ABILITIES` ledger ability is required to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the new Ethereum account address.
| abilities | [required] An `array` of `integer` numbers representing ledger abilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { AssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const abilities = [
    AssetLedgerAbility.CREATE_ASSET,
    AssetLedgerAbility.TOGGLE_TRANSFERS,
];

// perform mutation
const mutation = await ledger.revokeAbilities(accountId, abilities);
```

**See also:**

[grantAbilities](#grant-abilities)

### revokeAsset(assetId)

An `asynchronous` class instance `function` which destroys a specific `assetId` of an account. The asset is removed from the account but stays logged in the blockchain. The function is ment to be used by ledger owners to destroy assets of other accounts.

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

[destroyAsset](#destroy-asset)

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
    uriBase: 'http://swapmarket.com/',
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
    receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
    id: '100',
};

// perform mutation
const mutation = await ledger.transferAsset(recipe);
```

## Ledger abilities

Ledger abilities represent account-level permissions. For optimization reasons abilities are managed as bitfields for that reason enums are values of 2**n.

**Options:**

| Name | Value | Description
|-|-|-
| ALLOW_CREATE_ASSET | 32 | A specific ability that is bounded to atomic orders. When creating a new asset trough `OrderGateway`, the order maker has to have this ability.
| CREATE_ASSET | 2 | Allows an account to create a new asset.
| MANAGE_ABILITIES | 1 | Allows an account to further grant abilities.
| REVOKE_ASSET | 4 | Allows management accounts to revoke assets.
| TOGGLE_TRANSFERS | 8 | Allows an account to stop and start asset transfers.
| UPDATE_ASSET | 16 | Allows an account to update asset data.
| UPDATE_URI_BASE | 64 | Allows an account to update asset ledger's base URI.

**Example:**

```ts
import { AssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

const abilities = [
    AssetLedgerAbility.TOGGLE_TRANSFERS,
];
```

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
import { AssetLedgerCapability } from '@0xcert/ethereum-asset-ledger';

const capabilities = [
    AssetLedgerCapability.TOGGLE_TRANSFERS,
];
```

## Value ledger

Value ledger represents an ERC-20 related smart contract on the Ethereum blockchain.

### ValueLedger(provider, ledgerId)

A `class` which represents a smart contract on the Ethereum blockchain.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A string representing an address of the ERC-20 related smart contract on the Ethereum blockchain.
| provider | [required] An instance of an HTTP or MetaMask provider.

**Example:**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { ValueLedger } from '@0xcert/ethereum-value-ledger';

// arbitrary data
const provider = new MetamaskProvider();
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// perform mutation
const mutation = await ledger.approveValue(value, accountId);
```

**See also:**

[disapproveValue](#disapprove-value)

### deploy(provider, recipe)

An `asynchronous` static class `function` which deploys a new value ledger to the Ethereum blockchain.

**Arguments:**

| Argument | Description
|-|-
| provider | [required] An instance of an HTTP or MetaMask provider.
| recipe.name | [required] A `string` representing value ledger name.
| recipe.symbol | [required] A `string` representing value ledger symbol.
| recipe.decimals | [required] A big number `string` representing the number of decimals.
| recipe.supply | [required] A big number `string` representing the total supply of a ledger.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { ValueLedger } from '@0xcert/ethereum-value-ledger';

// arbitrary data
const provider = new MetamaskProvider();
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
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const spenderId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
| accountId | [required] A `string` representing the Ethereum account address.

**Result:**

A big number `string` representing the total value of the `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

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
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { ValueLedger } from '@0xcert/ethereum-value-ledger';

// arbitrary data
const provider = new MetamaskProvider();
const ledgerId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// create ledger instance
const ledger = ValueLedger.getInstance(provider, ledgerId);
```

### id

A class instance `variable` holding the address of ledger's smart contract on the Ethereum blockchain.

### isApprovedValue(value, accountId, spenderId)

An `asynchronous` class instance `function` which returns `true` when the `spenderId` has the ability to transfer the `value` from an `accountId`.

**Arguments:**

| Argument | Description
|-|-|-
| accountId | [required] A `string` representing the Ethereum account address that owns the funds.
| spenderId | [required] A `string` representing the approved Ethereum account address or an instance of the `OrderGateway` class.
| value | [required] A big number `string` representing the amount allowed to transfer.

**Result:**

A `boolean` which tells if the `spenderId` is approved to move `value` from `accountId`.

**Example:**

```ts
// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
const spenderId = '0xcc667f88e8821fb8d19f7e6240f44553ce3dbfdd';
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
    receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
    value: '1000000000000000000', // 1 unit (18 decimals)
};

// perform mutation
const mutation = await ledger.transferValue(recipe);
```

## Orders gateway

Order gateway allows for performing multiple actions in one single atomic operation.

### OrderGateway(provider, gatewayId)

A `class` which represents a smart contract on the Ethereum blockchain.

**Arguments**

| Argument | Description
|-|-
| gatewayId | [required] A `string` representing an address of the [0xcert order gateway smart contract](#public-addresses) on the Ethereum blockchain.
| provider | [required] An instance of an HTTP or MetaMask provider.

**Usage**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';

// arbitrary data
const provider = new MetamaskProvider();
const gatewayId = '0x073d230a53bffc8295d9a5247296213298e3fbcf';

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
| order.makerId | [required] A `string` representing the Ethereum account address which makes the order. It defaults to the `accountId` of a provider.
| order.seed | [required] An `integer` number representing the unique order number.
| order.takerId | [required] A `string` representing the Ethereum account address which will be able to perform the order on the blockchain. This account also pays for the gas cost.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { OrderActionKind } from '@0xcert/ethereum-order-gateway';

// arbitrary data
const order = {
    actions: [
        {
            kind: OrderActionKind.TRANSFER_ASSET,
            ledgerId: '0xcc377f78e8821fb8d19f7e6240f44553ce3dbfce',
            senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
    takerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
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
| order.makerId | [required] A `string` representing an Ethereum account address which makes the order. It defaults to the `accountId` of a provider.
| order.seed | [required] An `integer` number representing the unique order number.
| order.takerId | [required] A `string` representing the Ethereum account address which will be able to perform the order on the blockchain. This account also pays the gas cost.

**Result:**

A `string` representing order signature.

**Example:**

```ts
// arbitrary data
const order = {
    actions: [
        {
            kind: OrderActionKind.TRANSFER_ASSET,
            ledgerId: '0xcc377f78e8821fb8d19f7e6240f44553ce3dbfce',
            senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
    takerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
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
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';

// arbitrary data
const provider = new MetamaskProvider();
const gatewayId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';

// create gateway instance
const gateway = OrderGateway.getInstance(provider, gatewayId);
```

### id

A class instance `variable` holding the address of gateway's smart contract on the Ethereum blockchain.

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
| order.makerId | [required] A `string` representing an Ethereum account address which makes the order. It defaults to the `accountId` of a provider.
| order.seed | [required] An `integer` number representing the unique order number.
| order.takerId | [required] A `string` representing the Ethereum account address which will be able to perform the order on the blockchain. This account also pays the gas cost.

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
            ledgerId: '0xcc377f78e8821fb8d19f7e6240f44553ce3dbfce',
            senderId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            receiverId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
            assetId: '100',
        },
    ],
    expiration: Date.now() + 60 * 60 * 24, // 1 day
    seed: 12345,
    takerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
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
| OrderGateway | [0xabd785db74609461ec10d023625d3e09a16746d0](https://ropsten.etherscan.io/address/0xabd785db74609461ec10d023625d3e09a16746d0)
| TokenTransferProxy | [0xcadd178eb978b07b19c8c7f04a54fa337d9c4d8c](https://ropsten.etherscan.io/address/0xcadd178eb978b07b19c8c7f04a54fa337d9c4d8c)
| NFTokenTransferProxy | [0x28386bCdC913A0f5639C6ae70FF46E7BaCbB207D](https://ropsten.etherscan.io/address/0x28386bCdC913A0f5639C6ae70FF46E7BaCbB207D)
| NFTokenSafeTransferProxy | [0x4FE96F8b4C6Cfa819A4162AC4630787c191471e4](https://ropsten.etherscan.io/address/0x4FE96F8b4C6Cfa819A4162AC4630787c191471e4)
| XcertCreateProxy | [0x730dc765471340f68774A415E15f1cBc06d37BCE](https://ropsten.etherscan.io/address/0x730dc765471340f68774A415E15f1cBc06d37BCE)

### Ropsten

| Contract | Address
|-|-|-
| OrderGateway | [0x073d230a53bffc8295d9a5247296213298e3fbcf](https://ropsten.etherscan.io/address/0x073d230a53bffc8295d9a5247296213298e3fbcf)
| TokenTransferProxy | [0x61b47772fd1f98d88dfe887af7f897f0e403ac10](https://ropsten.etherscan.io/address/0x61b47772fd1f98d88dfe887af7f897f0e403ac10)
| NFTokenTransferProxy | [0x41f8e2f78d930259a03a348713879a79736fc57c](https://ropsten.etherscan.io/address/0x41f8e2f78d930259a03a348713879a79736fc57c)
| NFTokenSafeTransferProxy | [0x25ac60fbd008577bdea7cdb5ec6388d6f21546b0](https://ropsten.etherscan.io/address/0x25ac60fbd008577bdea7cdb5ec6388d6f21546b0)
| XcertCreateProxy | [0x7c1218ef246a53b71b6937ae4ae5f29a83387096](https://ropsten.etherscan.io/address/0x7c1218ef246a53b71b6937ae4ae5f29a83387096)

### Rinkeby

| Contract | Address
|-|-|-
| OrderGateway | [0x0827696c1a5ecea8a7f5bad02df93aad6516f41d](https://ropsten.etherscan.io/address/0x0827696c1a5ecea8a7f5bad02df93aad6516f41d)
| TokenTransferProxy | [0x4bca0e94239504e69bc25a3ef3c5ca6d80157c3d](https://ropsten.etherscan.io/address/0x4bca0e94239504e69bc25a3ef3c5ca6d80157c3d)
| NFTokenTransferProxy | [0x0a02d630669c75d5e162aec89e6adccf8ec1b475](https://ropsten.etherscan.io/address/0x0a02d630669c75d5e162aec89e6adccf8ec1b475)
| NFTokenSafeTransferProxy | [0x15731d295aee0b1631995ab19e350e0edc5691f6](https://ropsten.etherscan.io/address/0x15731d295aee0b1631995ab19e350e0edc5691f6)
| XcertCreateProxy | [0x67e20dd951ef09ae6aebd7c39903f89b2abd4c79](https://ropsten.etherscan.io/address/0x67e20dd951ef09ae6aebd7c39903f89b2abd4c79)
