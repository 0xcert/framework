# API / Ethereum

## Bitski back-end provider

A [Bitski](https://www.bitski.com/) back-end provider is applied to back-end Node.js usage. You will be able to connect to the Ethereum blockchain and create queries and mutations via your Bitski developer wallets. To set up Bitski back-end provider, you need to first create a [development account](https://developer.bitski.com/) on Bitski.

### BitskiProvider(options)

A class providing communication with the Ethereum blockchain through [Bitski](https://www.bitski.com/).

**Arguments**

| Argument | Description
|-|-
| options.accountId | A `string` representing the Ethereum account that will perform actions.
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.
| options.clientId | A string representing the Bitski client ID. You get the client ID by creating a [developer account](https://developer.bitski.com/) on Bitski.
| options.credentialsId | A string representing the Bitski credentials ID. You get the credentials ID by creating a [developer account](https://developer.bitski.com/) on Bitski.
| options.credentialsSecret | A `string` representing the Bitski secret. You get the credentials secret by creating a [developer account](https://developer.bitski.com/) on Bitski.
| options.gasPriceMultiplier | A `number` represents a multiplier of the current gas price when performing a mutation. It defaults to `1.1`.
| options.gatewayConfig.assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| options.gatewayConfig.actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| options.gatewayConfig.valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).
| options.mutationTimeout | The `number` of milliseconds after which a mutation times out. Defaults to `3600000`. You can set it to `-1` to disable the timeout.
| options.network | A string representing the Ethereum network we will connect to. Mainnet by default.
| options.retryGasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a retry action on mutation. It defaults to `2`.
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. Available options are `0` (eth_sign) or `2` (EIP-712) or `3` (personal_sign). It defaults to `0`.
| options.sandbox | A `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.
| options.unsafeRecipientIds | A list of strings representing smart contract addresses that do not support safe ERC-721 transfers (e.g., CryptoKitties address should be listed here).
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.
| options.verbose | A `boolean` indicating whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.


**Usage**

```ts
import { BitskiProvider } from '@0xcert/ethereum-bitski-backend-provider';

const provider = new BitskiProvider({
    clientId: '',
    credentialsId: '',
    credentialsSecret: '',
});
```

**See also:**

[Bitski front-end provider](#bitski-front-end-provider)

### accountId

A class instance `variable` holding a `string` which represents the user's current Ethereum wallet address.

### assetLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.

### buildGatewayConfig(networkKind)

A function that returns the current gateway config based on the deployed gateway smart contracts. Note that config will change based on release versions. If you do not want the smart contract addresses to update automatically, you should not use this function.

| Argument | Description
|-|-
| networkKind | [required] A `number` representing the Ethereum network for which we want to get the gateway config.

### clientId

A class instance `variable` holding a `string` which represents the Bitski client ID. You get the client ID by creating a [developer account](https://developer.bitski.com/) on Bitski.

### credentialsId

A class instance `variable` holding a `string` which represents the Bitski credentials ID. You get the credentials ID by creating a [developer account](https://developer.bitski.com/) on Bitski.

### credentialsSecret

A class instance `variable` holding a `string` which represents the Bitski secret. You get the credentials secret by creating a [developer account](https://developer.bitski.com/) on Bitski.

### emit(event, ...options);

A `synchronous` class instance `function` to manually trigger a provider event.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| options | [required] Pass valid current and previous account ID for `ACCOUNT_CHANGE` event or valid current and previous network version for `NETWORK_CHANGE` event.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { AccountEvent } from '@0xcert/ethereum-bitski-backend-provider';

mutation.emit(AccountEvent.NETWORK_CHANGE, '3');
```

### gatewayConfig

A class instance `variable` holding a `GatewayConfig` which represents the configuration for `Gateway` smart contracts.

**Arguments**

| Argument | Description
|-|-
| assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).

### getAvailableAccounts()

An `asynchronous` class instance `function` which returns currently available Ethereum wallet addresses.

**Result:**

A list of `strings` representing Ethereum account IDs.

**Example:**

```ts
// perform query
const accountIds = await provider.getAvailableAccounts();
```

### getInstance(options)

A static class `function` that returns a new instance of the BitskiProvider class (alias for `new BitskiProvider`).

**Arguments**

See the class [constructor](#bitski-provider) for details.

**Usage**

```ts
import { BitskiProvider } from '@0xcert/ethereum-bitski-backend-provider';

// create provider instance
const provider = BitskiProvider.getInstance();
```

### getNetworkVersion()

An `asynchronous` class instance `function` which returns the Ethereum network version (e.g. `1` for Ethereum Mainnet).

**Result:**

A `string` representing the Ethereum network version.

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
| accountId | [required] A `string` representing Ethereum account address.

**Result:**

A `boolean` which tells if the `accountId` matches the currently set account ID.

**Example:**

```ts
// ethereum wallet address
const walletId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const matches = provider.isCurrentAccount(walletId);
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

A `synchronous` class instance `function` which returns `true` when the provided `id` is listed among unsafe recipient IDs on the provider.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum blockchain.

**Result:**

A `boolean` which tells if the `id` is an unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const criptoKittiesId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(criptoKittiesId);
```

**See also:**

[unsafeRecipientIds](#unsaferecipientids)

### log(message)

A `synchronous` class instance `function` which logs message to console if verbose mode is active otherwise does nothing.

**Example:**

```ts
provider.log('message');
```

**Arguments:**

| Argument | Description
|-|-
| message | [required] Message to log.

### mutationTimeout

A class instance `variable` holding an `integer` number of milliseconds in which a mutation times out.

### network

A class instance `variable` holding a `string` representing the ethereum network bitski is connected to.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second argument is the old ID, and when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version and the second argument is the old version.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-bitski-backend-provider'; // or another provider

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
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second argument is the old ID, and when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version and the second argument is the old version.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-bitski-backend-provider';

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

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-bitski-backend-provider';

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

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

### verbose

A class instance `variable` holding a `boolean` which represents whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.

## Bitski front-end provider

A [Bitski](https://www.bitski.com/) front-end provider is applied for in-browser use. The user will be prompted to create/log into his Bitski account when creating mutations. The provider automatically establishes a communication channel to Bitski which further performs communication with the Ethereum blockchain. To setup Bitski front-end provider, you first need to create a [development account](https://developer.bitski.com/) on Bitski, you will also need to host a call-back page like [this](https://github.com/BitskiCo/bitski-js/blob/develop/packages/browser/callback.html), and authorize its URL on previously created development account.

### BitskiProvider(options)

A `class` providing communication with the Ethereum blockchain through [Bitski](https://www.bitski.com/).

**Arguments**

| Argument | Description
|-|-
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.
| options.clientId | A string representing the Bitski client ID. You get the client ID by creating a [developer account](https://developer.bitski.com/) on Bitski.
| options.gasPriceMultiplier | A `number` represents a multiplier of the current gas price when performing a mutation. It defaults to `1.1`.
| options.gatewayConfig.assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| options.gatewayConfig.actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| options.gatewayConfig.valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).
| options.mutationTimeout | The `number` of milliseconds after which a mutation times out. Defaults to `3600000`. You can set it to `-1` to disable the timeout.`
| options.network | A `string` or instance of `BitskiProviderNetwork` representing the Ethereum network we will connect to.
| options.redirectUrl | A `string` representing Bitski redirect URL. For Bitski front-end integration, you will need to create a call back to the website for OAuth2 and host it. Here is an [example](https://github.com/BitskiCo/bitski-js/blob/develop/packages/browser/callback.html). The URL to this HTML page also needs to be the app's authorized redirect URL in [Bitski Developer Portal](https://developer.bitski.com/).
| options.retryGasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a retry action on mutation. It defaults to `2`.
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. Available options are `0` (eth_sign) or `2` (EIP-712) or `3` (personal_sign). It defaults to `0`.
| options.sandbox | A `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers (e.g., CryptoKitties address should be listed here).
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.
| options.verbose | A `boolean` indicating whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.

**Usage**

```ts
import { BitskiProvider } from '@0xcert/ethereum-bitski-frontend-provider';

const provider = new BitskiProvider({
    clientId: '',
    redirectUrl: 'https://...',
});
```

**See also:**

[Bitski back-end provider](#bitski-back-end-provider)

### accountId

A class instance `variable` holding a `string` which represents the user's current Ethereum wallet address.

### assetLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.

### buildGatewayConfig(networkKind)

A function that returns the current gateway config based on the deployed gateway smart contracts. Note that config will change based on release versions. If you do not want the smart contract addresses to update automatically, you should not use this function.

| Argument | Description
|-|-
| networkKind | [required] A `number` representing the Ethereum network for which we want to get the gateway config.

### clientId

A class instance `variable` holding a `string` which represents the Bitski client ID. You get the client ID by creating a [developer account](https://developer.bitski.com/) on Bitski.

### emit(event, ...options);

A `synchronous` class instance `function` to manually trigger a provider event.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| options | [required] Pass valid current and previous account ID for `ACCOUNT_CHANGE` event or valid current and previous network versions for `NETWORK_CHANGE` event.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { AccountEvent } from '@0xcert/ethereum-bitski-front-end-provider';

mutation.emit(AccountEvent.NETWORK_CHANGE, '3');
```

### gatewayConfig

A class instance `variable` holding a `GatewayConfig` which represents the configuration for `Gateway` smart contracts.

**Arguments**

| Argument | Description
|-|-
| assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).

### getAvailableAccounts()

An `asynchronous` class instance `function` which returns currently available Ethereum wallet addresses.

**Result:**

A list of `strings` representing Ethereum account IDs.

**Example:**

```ts
// perform query
const accountIds = await provider.getAvailableAccounts();
```

### getConnectedUser()

An `asynchronous` class instance `function` which returns data of the currently signed in Bitski user. Will throw if no user is signed in.

**Result:**

An object representing Bitski user.

**Example:**

```ts
// perform query
const user = await provider.getConnectedUser();
```

### getInstance(options)

A static class `function` that returns a new instance of the BitskiProvider class (alias for `new BitskiProvider`).

**Arguments**

See the class [constructor](#bitski-provider) for details.

**Usage**

```ts
import { BitskiProvider } from '@0xcert/ethereum-bitski-frontend-provider';

// create provider instance
const provider = BitskiProvider.getInstance();
```

### getNetworkVersion()

An `asynchronous` class instance `function` which returns the Ethereum network version (e.g., `1` for Ethereum Mainnet).

**Result:**

A `string` representing the Ethereum network version.

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
| accountId | [required] A `string` representing Ethereum account address.

**Result:**

A `boolean` which tells if the `accountId` matches the currently set account ID.

**Example:**

```ts
// ethereum wallet address
const walletId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const matches = provider.isCurrentAccount(walletId);
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

### isSignedIn()

A `synchronous` class instance `function` which returns `true` when user is signed into Bitski.

**Result:**

A `boolean` which tells if the user is signed into Bitski.

**Example:**

```ts
// perform query
const isSignedIn = provider.isSignedIn();
```

### isUnsafeRecipientId(ledgerId)

A `synchronous` class instance `function` which returns `true` when the provided `id` is listed among unsafe recipient IDs on the provider.

**Arguments:**

| Argument | Description
|-|-
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum blockchain.

**Result:**

A `boolean` which tells if the `id` is an unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const criptoKittiesId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(criptoKittiesId);
```

**See also:**

[unsafeRecipientIds](#unsaferecipientids)

### log(message)

A `synchronous` class instance `function` which logs message to console if verbose mode is active otherwise does nothing.

**Example:**

```ts
provider.log('message');
```

### mutationTimeout

A class instance `variable` holding an `integer` number of milliseconds in which a mutation times out.

### network

A class instance `variable` holding a `string` or instance of `BitskiProviderNetwork` representing the ethereum network bitski is connected to.

`BitskiProviderNetwork` is defined as:

| Argument | Description
|-|-
| rpcUrl | A `string` representing an Url to RPC provider.
| chainId | A `number` representing the ID of ethereum chain.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second argument is the old ID, and when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version and the second argument is the old version.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-bitski-frontend-provider'; // or another provider

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
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second argument is the old ID, and when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version and the second argument is the old version.

**Result:**

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-bitski-frontend-provider';

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

An instance of the same provider class.

**Example:**

```ts
import { ProviderEvent } from '@0xcert/ethereum-bitski-frontend-provider';

provider.off(ProviderEvent.NETWORK_CHANGE);
```

**See also:**

[on (event, handler)](#on-event-handler), [once (event, handler)](#once-event-handler)

### redirectUrl

A class instance `variable` holding a `string` which represents the Bitski redirect URL. For Bitski front-end integration, you will need to create a call back to the website for OAuth2 and host it. Here is an [example](https://github.com/BitskiCo/bitski-js/blob/develop/packages/browser/callback.html). The URL to this HTML page also needs to be the app's authorized redirect URL in [Bitski Developer Portal](https://developer.bitski.com/).

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

### signIn()

An `asynchronous` class instance `function` which signs in the user and authorizes the provider.

::: warning
Calling this method should always be performed by a click handler (user-generated request) so the pop-up will not get blocked by the browser.
:::

**Example:**

```ts
// perform mutation
const provider = await provider.signIn();
```

### signMethod

A class instance `variable` holding a `string` which holds a type of signature that will be used (e.g., when creating claims).

### signOut()

An `asynchronous` class instance `function` which signs out the user and revokes provider authorization.

**Example:**

```ts
// perform mutation
const provider = await provider.signOut();
```

### unsafeRecipientIds

A class instance `variable` holding a `string` which represents smart contract addresses that do not support safe ERC-721 transfers.

### valueLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

### verbose

A class instance `variable` holding a `boolean` which represents whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.

## MetaMask provider

A MetaMask provider is applied for in-browser use. The user should have the [MetaMask](https://metamask.io/) installed. The provider automatically establishes a communication channel to MetaMask which further performs communication with the Ethereum blockchain.

### MetamaskProvider(options)

A `class` providing communication with the Ethereum blockchain through [MetaMask](https://metamask.io/).

**Arguments**

| Argument | Description
|-|-
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.
| options.gasPriceMultiplier | A `number` represents a multiplier of the current gas price when performing a mutation. It defaults to `1.1`.
| options.gatewayConfig.assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| options.gatewayConfig.actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| options.gatewayConfig.valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).
| options.mutationTimeout | The `number` of milliseconds after which a mutation times out. Defaults to `3600000`. You can set it to `-1` to disable the timeout.
| options.retryGasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a retry action on mutation. It defaults to `2`.
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. Available options are `0` (eth_sign) or `2` (EIP-712) or `3` (personal_sign). It defaults to `0`.
| options.sandbox | A `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers (e.g. CryptoKitties address should be listed here).
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.
| options.verbose | A `boolean` indicating whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.

**Usage**

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';

const provider = new MetamaskProvider();
```

**See also:**

[HttpProvider](#http-provider)

### accountId

A class instance `variable` holding a `string` which represents the user's current Ethereum wallet address.

### assetLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-721 related smart contract definition file. This file is used when deploying new asset ledgers to the network.

### buildGatewayConfig(networkKind)

A function that returns the current gateway config based on the deployed gateway smart contracts. Note that config will change based on release versions. If you do not want the smart contract addresses to update automatically, you should not use this function.

| Argument | Description
|-|-
| networkKind | [required] A `number` representing the Ethereum network for which we want to get the gateway config.

### emit(event, ...options);

A `synchronous` class instance `function` to manually trigger a provider event.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| options | [required] Pass valid current and previous account ID for `ACCOUNT_CHANGE` event or valid current and previous network version for `NETWORK_CHANGE` event.

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

### gatewayConfig

A class instance `variable` holding a `GatewayConfig` which represents the configuration for `Gateway` smart contracts.

**Arguments**

| Argument | Description
|-|-
| assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).

### getAvailableAccounts()

An `asynchronous` class instance `function` which returns currently available Ethereum wallet addresses.

**Result:**

A list of `strings` representing Ethereum account IDs.

**Example:**

```ts
// perform query
const accountIds = await provider.getAvailableAccounts();
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

### isCurrentAccount(accountId)

A `synchronous` class instance `function` which returns `true` when the provided `accountId` matches the currently set account ID.

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing Ethereum account address.

**Result:**

A `boolean` which tells if the `accountId` matches the currently set account ID.

**Example:**

```ts
// ethereum wallet address
const walletId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const matches = provider.isCurrentAccount(walletId);
```

### isEnabled()

An `asynchronous` class instance `function` which returns `true` when the provider is authorized by the website.

**Result:**

A `boolean` that tells if the provider is enabled.

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

A `boolean` which tells if the `id` is an unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const criptoKittiesId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(criptoKittiesId);
```

**See also:**

[unsafeRecipientIds](#unsaferecipientids)

### log(message)

A `synchronous` class instance `function` which logs message to console if verbose mode is active otherwise does nothing.

**Example:**

```ts
provider.log('message');
```

### mutationTimeout

A class instance `variable` holding an `integer` number of milliseconds in which a mutation times out.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second is the old one, when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version and the second is the old one.

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
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second is the old one, when the `event` equals `NETWORK_CHANGE`, the first argument is a new network version and the second is the old one.

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

A class instance `variable` holding a `string` which holds a type of signature that will be used (e.g. when creating claims).

### unsafeRecipientIds

A class instance `variable` holding a `string` which represents smart contract addresses that do not support safe ERC-721 transfers.

### valueLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

### verbose

A class instance `variable` holding a `boolean` which represents whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.

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
| options.accountId | A `string` representing the Ethereum account that will perform actions.
| options.assetLedgerSource | A `string` representing the URL to the compiled ERC-721 related smart contract definition file.
| options.cache | A `string` representing request cache type. It defaults to `no-cache`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.credentials | A `string` representing request credentials. It defaults to `omit`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.gasPriceMultiplier | A `number` represents a multiplier of the current gas price when performing a mutation. It defaults to `1.1`.
| options.gatewayConfig.assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| options.gatewayConfig.actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| options.gatewayConfig.valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).
| options.headers | An `object` of request headers. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mode | A `string` representing request mode. It defaults to `same-origin`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.mutationTimeout | The `number` of milliseconds after which a mutation times out. Defaults to `3600000`. You can set it to `-1` to disable the timeout.
| options.redirect | A `string` representing request redirect mode. It defaults to `follow`. Please see more details [here](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
| options.retryGasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a retry action on mutation. It defaults to `2`.
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. Available options are `0` (eth_sign) or `2` (EIP-712) or `3` (personal_sign). It defaults to `0`.
| options.sandbox | A `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers.
| options.url | [required] A `string` representing the URL to the Ethereum node's JSON RPC.
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file.
| options.verbose | A `boolean` indicating whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.

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

### buildGatewayConfig(networkKind)

A function that returns the current gateway config based on the deployed gateway smart contracts. Note that config will change based on release versions. If you do not want the smart contract addresses to update automatically, you should not use this function.

| Argument | Description
|-|-
| networkKind | [required] A `number` representing the Ethereum network for which we want to get the gateway config.

### getAvailableAccounts()

An `asynchronous` class instance `function` which returns currently available Ethereum wallet addresses.

**Result:**

A list of `strings` representing Ethereum account IDs.

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
import { HttpProvider } from '@0xcert/ethereum-http-provider';

// create provider instance
const provider = HttpProvider.getInstance();
```

### getNetworkVersion()

An `asynchronous` class instance `function` which returns the Ethereum network version (e.g. `1` for Ethereum Mainnet).

**Result:**

A `string` representing the Ethereum network version.

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
| accountId | [required] A `string` representing Ethereum account address.

**Result:**

A `boolean` which tells if the `accountId` matches the currently set account ID.

**Example:**

```ts
// ethereum wallet address
const walletId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const matches = provider.isCurrentAccount(walletId);
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
| ledgerId | [required] A `string` representing an address of the ERC-721 related smart contract on the Ethereum blockchain.

**Result:**

A `boolean` which tells if the `id` is an unsafe recipient.

**Example:**

```ts
// unsafe recipient address
const criptoKittiesId = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

// perform query
const isUnsafe = provider.isUnsafeRecipientId(criptoKittiesId);
```

**See also:**

[unsafeRecipientIds](#unsaferecipientids-2)

### log(message)

A `synchronous` class instance `function` which logs message to console if verbose mode is active otherwise does nothing.

**Example:**

```ts
provider.log('message');
```

### mutationTimeout

A class instance `variable` holding an `integer` number of milliseconds in which a mutation times out.

### on(event, handler);

A `synchronous` class instance `function` which attaches a new event handler.

**Arguments:**

| Argument | Description
|-|-
| event | [required] A `string` representing a [provider event](./ethereum.md#provider-events) name.
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second is the old one.

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
| handler | [required] A callback `function` which is triggered on each `event`. When the `event` equals `ACCOUNT_CHANGE`, the first argument is a new account ID and the second is the old one.

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

A class instance `variable` holding a `string` which holds a type of signature that will be used (e.g. when creating claims).

### unsafeRecipientIds

A class instance `variable` holding a `string` which represents smart contract addresses that do not support safe ERC-721 transfers.

### valueLedgerSource

A class instance `variable` holding a `string` which represents the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

### verbose

A class instance `variable` holding a `boolean` which represents whether you are in verbose mode. Verbose mode means you will get more detailed information in the console about what is going on. It defaults to `false`.

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

### Mutation(provider, mutationId, context?)

A `class` which handles transaction-related operations on the Ethereum blockchain.

**Arguments**

| Argument | Description
|-|-
| context | An instance of `AssetLedger`, `ValueLedger` or `Gateway`. The context of a mutation informs of the kind of a mutation and will be able to parse `Logs` based on that information. If context is not provided, the logs will be left blank.
| mutationId | [required] A `string` representing a hash string of an Ethereum transaction.
| provider | [required] An instance of provider.

**Usage**

```ts
import { Mutation } from '@0xcert/ethereum-metamask-provider'; // or HTTP provider

// arbitrary data
const mutationId = '0x767857798ea7c8d21ad72c4d7e054ed45ab5d177c06baa2183dbfc3b61926963';

// create mutation instance
const mutation = new Mutation(provider, mutationId);
```

### cancel()

An `asynchronous` class instance `function` which attempts to cancel a mutation. You can only cancel a mutation that has not yet been accepted onto the blockchain. Canceling works by overwriting a pending mutation (using the same [nonce](https://kb.myetherwallet.com/en/transactions/what-is-nonce/)) with a new mutation that performs no action, which could also lead the `cancel` function to fail. The `cancel` function will throw an error if the mutation has already been accepted onto the blockchain or if you are not the originator of the mutation you want to cancel.

### complete()

An `asynchronous` class instance `function` which waits until a mutation reaches a specified number of confirmations.

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

### logs

A class instance `variable` holding an `array` of logs. It only resolves if you called either `complete()` or `resolve()` function upon `Mutation` and if the `Mutation` context is set. Logs are dynamically defined and represent `Events` that were triggered by the smart contract.

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
When you are deploying a new ledger, this variable represents the ledger ID and remains `null` until a mutation is completed.
:::

### retry()

An `asynchronous` class instance `function` which resubmits the same mutation to the blockchain at a higher price. Since the speed of accepting mutations onto the blockchain depends on the current network state, a mutation could remain unconfirmed for a while. In that case, you can retry submitting the same mutation at an increased price to speed up its acceptance onto the blockchain. The price is determined by the current network price, multiplied by `retryGasPriceMultiplier` parameter on the provider (which defaults to `2`). Note that this method will throw an error if the mutation has already been accepted onto the blockchain.

### resolve()

An `asynchronous` class instance `function` which resolves current mutation status.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// resolves current mutation
await mutation.revoke();
```

**See also:**

[complete()](#complete)

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
| provider | [required] An instance of provider.

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
| accountId | [required] A `string` representing the new owner's Ethereum account address or an instance of the `Gateway` class.

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
| accountId | [required] A `string` representing an Ethereum account address that will receive new management permissions on this ledger.

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

An `asynchronous` class instance `function` which destroys a specific `assetId` on the Ethereum blockchain. The asset is removed from the account and all queries about it will be invalid. The function succeeds only when performed by the asset's owner. This function is similar to `revokeAsset` but it differs in who can trigger it.

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
| accountId | [required] A `string` representing the new Ethereum account address.

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

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing the Ethereum account address for which we want to get abilities.

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
The `MANAGE_ABILITIES` super ability of the ledger is required to perform this function.
:::

**Arguments:**

| Argument | Description
|-|-
| accountId | [required] A `string` representing an Ethereum account address that will receive new management permissions on this ledger.
| abilities | [required] An array of `integers` representing this ledger's smart contract abilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { GeneralAssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
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
| accountId | [required] A `string` representing the Ethereum account address.
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
| operatorId | [required] A `string` representing a third-party Ethereum account address.

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
The `MANAGE_ABILITIES` super ability of the ledger is required to perform this function.
:::

::: warning
You can revoke your own `MANAGE_ABILITIES` super ability.
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
import { GeneralAssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

// arbitrary data
const accountId = '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce';
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
| accountId | [required] A `string` representing the new Ethereum account address.
| abilities | [required] An `array` of `integer` numbers representing ledger abilities.

**Result:**

An instance of the same mutation class.

**Example:**

```ts
import { GeneralAssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

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

[updateAsset](#update-asset-assetid-recipe)

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
We have two categories of abilities, general and super. General abilities are abilities that can not change other account's abilities whereas super abilities can.
This categorization is for safety purposes since revoking your own super ability can lead to unintentional loss of control.

**Super abilities options:**

| Name | Value | Description
|-|-|-
| MANAGE_ABILITIES | 1 | Allows an account to further grant abilities.
| ALLOW_MANAGE_ABILITIES | 2 | A specific ability that is bounded to atomic orders. When granting or revoking abilities through `Gateway`, the order maker has to have this ability.

**General abilities options:**

| Name | Value | Description
|-|-|-
| ALLOW_CREATE_ASSET | 512 | A specific ability that is bounded to atomic orders. When creating a new asset through `Gateway`, the order maker has to have this ability.
| ALLOW_UPDATE_ASSET_IMPRINT | 1024 | A specific ability that is bounded to atomic orders. When updating asset imprint through `Gateway`, the order maker has to have this ability.
| CREATE_ASSET | 16 | Allows an account to create a new asset.
| REVOKE_ASSET | 32 | Allows management accounts to revoke assets.
| TOGGLE_TRANSFERS | 64 | Allows an account to stop and start asset transfers.
| UPDATE_ASSET | 128 | Allows an account to update asset data.
| UPDATE_URI | 256 | Allows an account to update asset ledger's URI prefix and postfix.

**Example:**

```ts
import { GeneralAssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';
import { SuperAssetLedgerAbility } from '@0xcert/ethereum-asset-ledger';

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
| provider | [required] An instance of provider.

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
| accountId | [required] A `string` representing an account address.
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
| provider | [required] An instance of provider.
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
| accountId | [required] A `string` representing an account address.

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
| spenderId | [required] A `string` representing the account ID of a spender.

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
|-|-
| accountId | [required] A `string` representing the Ethereum account address that owns the funds.
| spenderId | [required] A `string` representing the approved Ethereum account address.
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

## Gateway

The Gateway allows for performing multiple actions in a single atomic swap. The gateway always operate with an order.
There are different kinds of order depending on what action you want to perform. We can seperate them in two groups
based on their functionality and their flow. First there are orders for deploying a new `ValueLedger` and `AssetLedger`. 
These two orders only perform the deployment of a new smart contract to the blockchain plus a transfer of erc20 (value). 
They are primarily targeted for delegating a deployment to a third party. For example you want to deploy a new `AssetLedger`
but you do not want to do that yourself you can pay someone some erc20 tokens to perfom that for you. This tho orders have a flow
which is as follows:

1. Maker (address creating an order) defines the order (who will be the owner of the newly deployed ledger, who will receive token etc.).
2. Maker generates the order claim and signs it (`sign` function).
3. Maker approves value transfer if necessary
4. Maker sends the order and signature to the taker (trough arbitrary ways).
5. Taker performs the order.

In this case it is possible that taker can also be defined as "anyone" meaning you can define an order basically saying I am willing to pay x tokens to anyone wanting to create this ledger for me.

Order kinds that fit into this group are:
- `DeployAssetLedgerOrder`
- `DeployValueLedgerOrder` 

Then we have orders for performing actions on existing ledgers. This orders are really powerfull but that makes them a bit more complex.
Unlike deploy orders that have a specific maker and taker the actions order are more dynamic allowing X participants that need to sign an order for it to be valid.
That also means that we can have multiple participants performing actions in a single atomic order. Actions that can be performed are the following:
- Transfer asset
- Transfer value
- Create new asset
- Update existing asset imprint
- Destroy an asset
- Update account abilities

Because we have multiple participants in an order there are 4 different ways how we interact with is resulting in 4 `ActionsOrder`s differentiating only in how participants interact with it. Namely:
- `FixedActionsOrder` - All participants are known and set in the order. Only the last defined participant can peform the order, others have to provide signatures.
- `SignedFixedActionsOrder` - All participants are known and set in the order. All participants have to provide signatures. Anyone can perform the order.
- `DynamicActionsOrder` - The last participant can be an unknown - "any". All defined participants have to provide signatures any can peform the order and he automatically becomes the last participant.
- `SignedDynamicActionsOrder` - The last participant can be an unknown - "any". All defined participants have to provide signatures as well as the last "any" participant. Anyone can perform the order.

To better explain the above in an example. Lets say I want to sell two CryptoKitties for 5000 ZXC. Any I want so that anyone can buy it I would use a `DynamicActionsOrder` since I do not need to set the `receiverId` of the CryptoKitties and neither the `senderId` of ZXC. Meaning anyone that want to peform the order will automatically become the empty recipient/sender and we will exchange the goods. If I use the same case but know exactly that I want to sell My CryptoKitties to Bob for 5000 ZXC I will use `FixedActionsOrder` so that I can specify exactly who will be the receiver. Now lets say that Bob in this case does not have any ETH and is unable to perform the order but he has tons of ZXC tokens but his friend Sara is willing to help him out. Then we can use a `SignedFixedActionsOrder` so that Bob only needs to sign the order and Sara can peform it. If he wanted to pay Sara some ZXC for doing this, he could also specify this in the order.

Basically `signed` orders are meant for third party services provided order execution for someone else which can come in handy when developing DAPPs.

::: warning
When using dynamic order, you cannot send any of the assets to the zero address (0x000...0), since the zero address is reserved for replacing the order taker in the smart contract.
:::

### Gateway(provider, gatewayConfig?)

A `class` representing a smart contract on the Ethereum blockchain.

**Arguments**

| Argument | Description
|-|-
| gatewayConfig.assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| gatewayConfig.actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| gatewayConfig.valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).
| provider | [required] An instance of provider.

**Usage**

```ts
import { MetamaskProvider, buildGatewayConfig } from '@0xcert/ethereum-metamask-provider';
import { Gateway } from '@0xcert/ethereum-gateway';

// arbitrary data
const provider = new MetamaskProvider();

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
import { MetamaskProvider, buildGatewayConfig } from '@0xcert/ethereum-metamask-provider';
import { Gateway } from '@0xcert/ethereum-gateway';

// arbitrary data
const provider = new MetamaskProvider();

// create gateway instance
const gateway = Gateway.getInstance(provider, buildGatewayConfig(NetworkType.ROPSTEN));
```

## getProxyAccountId(proxyKind, ledgerId?)

An `asynchronous` class instance `function` which gets the accountId of desired proxy from the gateway smart contract infrastructure.

**Arguments:**

| Argument | Description
|-|-
| proxyKind | [required] An `ProxyKind` option.

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

Order defines what an atomic swap will do. There are three different order kinds with different use cases and definitions.

### Asset ledger deploy order

This order kind is used for delegating `AssetLedger` deploy.

| Argument | Description
|-|-
| assetLedgerData.capabilities | [required] A list of `integers` representing ledger capabilities.
| assetLedgerData.name | [required] A `string` representing asset ledger name.
| assetLedgerData.owner | [required] A `string` representing Ethereum wallet, which will be the owner of the asset ledger.
| assetLedgerData.schemaId | [required] A `string` representing data schema ID.
| assetLedgerData.symbol | [required] A `string` representing asset ledger symbol.
| assetLedgerData.uriPrefix | [required] A `string` representing prefix of asset URI.
| assetLedgerData.uriPostfix | [required] A `string` representing postfix of asset URI.
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.ASSET_LEDGER_DEPLOY_ORDER`.
| makerId | [required] A `string` representing an Ethereum account address which makes the order. It defaults to the `accountId` of a provider.
| seed | [required] An `integer` number representing a unique order number.
| takerId | A `string` representing the Ethereum account address which will be able to perform the order on the blockchain. This account also pays the gas cost.
| tokenTransferData.ledgerId | [required] A `string` representing asset ledger address.
| tokenTransferData.receiverId | A `string` representing the receiver's address.
| tokenTransferData.value | [required] A big number `string` representing the transferred amount.

### DynamicActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities and destorying assets.
Participants (signers) are defined but the last one is not defined meaning anyone with the order and signatures from other participants can perform the order and by doing so becomes the last "unknown" participant.

| Argument | Description
|-|-
| actions | [required] An `array` of [dynamic actions order action objects](#actions order-actions).
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.DYNAMIC_ACTIONS_ORDER`.
| seed | [required] An `integer` number representing a unique order number.
| signers | [required] A `string[]` representing order signers.

### FixedActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities and destorying assets.
All participants(signers) have to be known beforehand and the last defined signer can peform the order (his signature is not needed since he is the one performing the order).

| Argument | Description
|-|-
| actions | [required] An `array` of [fixed actions order action objects](#actions order-actions).
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.FIXED_ACTIONS_ORDER`.
| seed | [required] An `integer` number representing a unique order number.
| signers | [required] A `string[]` representing order signers.

### SignedDynamicActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities and destorying assets.
Participants (signers) are defined but the last one is not defined meaning anyone can provide the last signature and by doing so becomes the last participant. Anyone that has all of the signatures is able to perform the order.

| Argument | Description
|-|-
| actions | [required] An `array` of [dynamic actions order action objects](#actions order-actions).
| expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| kind | [required] An `integer` number that equals to `OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER`.
| seed | [required] An `integer` number representing a unique order number.
| signers | [required] A `string[]` representing order signers.

### SignedFixedActionsOrder

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update, setting user abilities and destorying assets.
All participants(signers) have to be known beforehand and with all signatures provided anyone can perform the order.

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
| makerId | [required] A `string` representing an Ethereum account address which makes the order. It defaults to the `accountId` of a provider.
| seed | [required] An `integer` number representing a unique order number.
| takerId | A `string` representing the Ethereum account address which will be able to perform the order on the blockchain. This account also pays the gas cost.
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

This are latest addresses that work with version 2.0.0 For older addresses check docs v1.

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

### Ropsten

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

### Rinkeby

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

## Possible errors

The 0xcert framework handles anykind of error that happens either from smart contracts or from the framework itself and provides a meaningfull description if possible.

Error example: 

```ts
{
  name: 'ProviderError',
  issue: '001001',
  original: '', // optional
  message: 'Sender does not have sufficient balance.'
}
```

This is a list of all possible errors that can be thrown by the 0xcert framework. The list is split into two categories depending on where the error originates.

### Framework errors

| Code | Description
|-|-
| 0 | Generic provider error
| 5000001 | Actions order kind not supported.
| 5000002 | Amount of signature not consistent with signers for DYNAMIC_ACTIONS_ORDER kind.
| 5000003 | Amount of signature not consistent with signers for FIXED_ACTIONS_ORDER kind.
| 5000004 | Amount of signature not consistent with signers for SIGNED_DYNAMIC_ACTIONS_ORDER kind.
| 5000005 | Amount of signature not consistent with signers for SIGNED_FIXED_ACTIONS_ORDER kind.
| 5000006 | ReceiverId is not set.
| 5000007 | SenderId is not a signer.
| 5000008 | SenderId is not a signer.
| 5000009 | Both senderId and receiverId are missing.
| 5000010 | Not implemented.
| 5000011 | First set approval to 0. ERC-20 token potential attack.

### Smart contract errors

| Code | Description
|-|-
| 1 | Generic smart contract error
| 001001 | Sender does not have sufficient balance.
| 001002 | You do not have sufficient allowance.
| 003001 | Provided address cannot be zero address.
| 003002 | Asset with this ID does not exist.
| 003003 | Sender is neither asset owner nor operator.
| 003004 | Sender is neither asset owner, approved nor operator.
| 003005 | Receiver is not able to safely receive the asset.
| 003006 | Asset with provided ID already exists.
| 004001 | Provided address cannot be zero address.
| 004002 | Asset with this ID does not exist.
| 004003 | Sender is neither asset owner nor operator.
| 004004 | Sender is neither asset owner, approved nor operator.
| 004005 | Receiver is not able to safely receive the asset.
| 004006 | Asset with provided ID already exists.
| 005001 | Provided address cannot be zero address.
| 005002 | Asset with this ID does not exist.
| 005003 | Sender is neither asset owner nor operator.
| 005004 | Sender is neither asset owner, approved nor operator.
| 005005 | Receiver is not able to safely receive the asset.
| 005006 | Asset with provided ID already exists.
| 005007 | There is no asset at provided index.
| 006001 | Provided address cannot be zero address.
| 006002 | Asset with this ID does not exist.
| 006003 | Sender is neither asset owner nor operator.
| 006004 | Sender is neither asset owner, approved nor operator.
| 006005 | Receiver is not able to safely receive the asset.
| 006006 | Asset with provided ID already exists.
| 006007 | There is no asset at provided index.
| 007001 | Asset ledger does not have capability for this action.
| 007002 | Transfers on this asset ledger are currently disabled.
| 007003 | Asset with this ID does not exist.
| 007004 | Sender is neither asset owner nor operator.
| 007005 | Provided signature is invalid.
| 007006 | Provided signature kind is invalid.
| 007007 | This order was already performed.
| 007008 | This order has expired.
| 008001 | This action caused a math error: overflow.
| 008002 | This action caused a math error: subtrahend is greater than minuend.
| 008003 | This action caused a math error: division by zero.
| 009001 | Provided signature kind is invalid.
| 009002 | Sender is not allowed to execute this order.
| 009003 | This order has expired.
| 009004 | Provided signature is invalid.
| 009005 | This order was canceled.
| 009006 | This order was already performed.
| 009007 | Sender is not the creator of this order.
| 010001 | Sender does not have sufficient balance.
| 010002 | You do not have sufficient allowance.
| 010003 | Tokens cannot be sent to this recipient. Recipients are limited.
| 010004 | Migration is not in progress.
| 010005 | Migration is in progress.
| 010006 | Migration cannot be performed. Please notify token owner.
| 011001 | Provided signature kind is invalid.
| 011002 | Sender is not allowed to execute this order.
| 011003 | This order has expired.
| 011004 | Provided signature is invalid.
| 011005 | This order was canceled.
| 011006 | This order was already performed.
| 011007 | Sender is not the creator of this order.
| 012001 | Transfer failed.
| 015001 | Provided signature kind is invalid.
| 015002 | Invalid proxy.
| 015003 | Sender is not one of the signers.
| 015004 | This order has expired.
| 015005 | Provided signature is invalid.
| 015006 | This order was canceled.
| 015007 | This order was already performed.
| 015008 | Sender is not one of the signers.
| 015009 | Signer of CREATE_ASSET action does not have ALLOW_CREATE_ASSET ability.
| 015010 | Signer of UPDATE_ASSET action does not have ALLOW_UPDATE_ASSET ability.
| 015011 | Signer of SET_ASSET_LEDGER_ABILITY action does not have ALLOW_MANAGE_ABILITIES ability.
| 015012 | Signer of DESTROY_ASSET action is not the asset owner.
| 017001 | Sender does not have specified ability.
| 017002 | Ability 0 is not a valid ability.
| 018001 | Sender is not an owner.
| 018002 | Provided address cannot be zero address.
| 019001 | Sender cannot claim ownership.
