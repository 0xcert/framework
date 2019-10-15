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
| options.networkName | A string representing the Ethereum network we will connect to.
| options.retryGasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a retry action on mutation. It defaults to `2`.
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. Available options are `0` (eth_sign) or `2` (EIP-712) or `3` (personal_sign). It defaults to `0`.
| options.sandbox | A `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.
| options.unsafeRecipientIds | A list of strings representing smart contract addresses that do not support safe ERC-721 transfers (e.g., CryptoKitties address should be listed here).
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

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
| options.networkName | A `string` representing the Ethereum network we will connect to.
| options.redirectUrl | A `string` representing Bitski redirect URL. For Bitski front-end integration, you will need to create a call back to the website for OAuth2 and host it. Here is an [example](https://github.com/BitskiCo/bitski-js/blob/develop/packages/browser/callback.html). The URL to this HTML page also needs to be the app's authorized redirect URL in [Bitski Developer Portal](https://developer.bitski.com/).
| options.retryGasPriceMultiplier | A `number` representing a multiplier of the current gas price when performing a retry action on mutation. It defaults to `2`.
| options.requiredConfirmations | An `integer` representing the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.
| options.signMethod | An `integer` representing the signature type. Available options are `0` (eth_sign) or `2` (EIP-712) or `3` (personal_sign). It defaults to `0`.
| options.sandbox | A `boolean` indicating whether you are in sandbox mode. Sandbox mode means you don't make an actual mutation to the blockchain, but you only check whether a mutation would succeed or not.
| options.unsafeRecipientIds | A list of `strings` representing smart contract addresses that do not support safe ERC-721 transfers (e.g., CryptoKitties address should be listed here).
| options.valueLedgerSource | A `string` representing the URL to the compiled ERC-20 related smart contract definition file. This file is used when deploying new value ledgers to the network.

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

### requiredConfirmations

A class instance `variable` holding a `string` which represents the number of confirmations needed for mutations to be considered confirmed. It defaults to `1`.

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

## MetaMask provider

A MetaMask provider is applied for in-browser use. The user should have the [MetaMask](https://metamask.io/) installed. The provider automatically establishes a communication channel to MetaMask which further performs communication with the Ethereum blockchain.

### MetamaskProvider(options)

A `class` providing the communication with the Ethereum blockchain through [MetaMask](https://metamask.io/).

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
|-|-
| context | An instance of `AssetLedger`, `ValueLedger` or `Gateway`. The context of a mutation informs of the kind of a mutation and will be able to parse `Logs` based on that information. If context is not provided, the logs will be left blank.
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
| accountId | [required] A `string` representing an Ethereum account address or an instance of the `Gateway` class that will receive new management permissions on this ledger.

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
    schemaId: '0x3f4a0870cd6039e6c987b067b0d28de54efea17449175d7a8cd6ec10ab23cc5d', // base asset schemaId
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
| accountId | [required] A `string` representing the new Ethereum account address or an instance of the `Gateway` class.

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
| accountId | [required] A `string` representing an Ethereum account address or an instance of the `Gateway` class that will receive new management permissions on this ledger.
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
| accountId | [required] A `string` representing the Ethereum account address or an instance of the `Gateway` class.
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
| operatorId | [required] A `string` representing a third-party Ethereum account address or an instance of the `Gateway` class.

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
| accountId | [required] A `string` representing an account address or an instance of the `Gateway` class.
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
| accountId | [required] A `string` representing an account address or an instance of the `Gateway` class.

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
| spenderId | [required] A `string` representing the account ID of a spender or an instance of the `Gateway` class.

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
| spenderId | [required] A `string` representing the approved Ethereum account address or an instance of the `Gateway` class.
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

The Gateway allows for performing multiple actions in a single atomic swap.
To perform an atomic order through `Gateway`, you need to follow its flow:

1. Maker (address creating an order) defines the order (who will transfer what to who).
2. Maker generates the order claim and signs it (claims functions).
3. Maker approves/assigns abilities for all the assets if necessary.
4. Maker sends the order and signature to the taker.
5. Taker approves/assigns abilities for all the required assets if necessary.
6. Taker performs the order.

`Order` class is responsible for defining what will happen in the atomic swap. We currently support three different order kinds:

1. `ASSET_LEDGER_DEPLOY_ORDER`
Is meant for delegating deployment of `AssetLedger`.
- Deploys a new asset ledger
- Transfers value
2. `VALUE_LEDGER_DEPLOY_ORDER`
Is meant for delegating deployment of `ValueLedger`.
- Deploys a new value ledger
- Transfers value
3. `MULTI_ORDER`
Can perform multiple actions between multiple actors such as:
- Transfer asset
- Transfer value
- Create new asset
- Update existing asset imprint

All orders can be configured in two ways, namely in fixed and dynamic order.

In a fixed order, the taker of the order (its wallet address) is known, and we want to make an atomic order specifically with the taker and no-one else. For this, we need to set `order.takerId` and all variables that present the receiver or the sender.

In a dynamic order, we do not care who performs the order as long as they have the assets we specified. In this case, we do not set an `order.takerId`. Instead, we need to set either the sender or the receiver or both, but we are not allowed to leave those parameters blank - if we do, any function called with this order will throw an error. A dynamic order allows any account (wallet) to perform such an order and automatically become its taker - this will replace every empty parameter with the taker's address.

::: warning
When using dynamic order, you cannot send any of the assets to the zero address (0x000...0), since the zero address is reserved for replacing the order taker in the smart contract.
:::

### Gateway(provider, gatewayConfig)

A `class` representing a smart contract on the Ethereum blockchain.

**Arguments**

| Argument | Description
|-|-
| gatewayConfig.assetLedgerDeployOrderId | A `string` representing an Ethereum address of the [asset ledger deploy gateway](/#public-addresses).
| gatewayConfig.actionsOrderId | A `string` representing an Ethereum address of the [actions gateway](/#public-addresses).
| gatewayConfig.valueLedgerDeployOrderId | A `string` representing an Ethereum address of the [value ledger deploy gateway](/#public-addresses).
| provider | [required] An instance of an HTTP or MetaMask provider.

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
    kind: OrderKind.ACTIONS_ORDER,
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
    makerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
    takerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
};

// perform mutation
const mutation = await gateway.cancel(order);
```

**See also:**

[claim](#claim), [perform](#perform)

### claim(order)

An `asynchronous` class instance `function` which cryptographically signs the provided `order` and returns a signature.

::: warning
This operation must be executed by the maker of the order.
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
    kind: OrderKind.ACTIONS_ORDER,
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
    makerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
    takerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
};

// perform query
const signature = await gateway.claim(order);
```

### getInstance(provider, gatewayConfig)

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

### id

A class instance `variable` holding the address of gateway's smart contract on the Ethereum blockchain.

### perform(order, signature)

An `asynchronous` class instance `function` which submits the `order` with a `signature` from the maker.

::: warning
This operation must be executed by the taker of the order.
:::

**Arguments:**

| Argument | Description
|-|-
| signature | [required] A `string` representing order signature created by the maker.
| order | [required] An [`Order` object](#order-kinds).

**Result:**

An instance of the same mutation class.

**Example:**

```ts
// arbitrary data
const signature = 'fe3ea95fa6bda2001c58fd13d5c7655f83b8c8bf225b9dfa7b8c7311b8b68933';
const order = {
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
    takerId: '0xcc567f78e8821fb8d19f7e6240f44553ce3dbfce',
};

// perform mutation
const mutation = await gateway.perform(order, signature);
```

**See also:**

[cancel](#cancel)

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

### Multi-order

This order kind can perform multiple operations such as value transfer, asset transfer, asset creation, asset update.

| Argument | Description
|-|-
| signature | [required] A `string` representing order signature created by the maker.
| order.actions | [required] An `array` of [actions order action objects](#actions order-actions).
| order.expiration | [required] An `integer` number representing the timestamp in milliseconds after which the order expires and can not be performed any more.
| order.makerId | [required] A `string` representing an Ethereum account address which makes the order. It defaults to the `accountId` of a provider.
| order.seed | [required] An `integer` number representing a unique order number.
| order.takerId | A `string` representing the Ethereum account address which will be able to perform the order on the blockchain. This account also pays the gas cost.

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

## Multi-order actions

Multi-order actions define the atomic operations of the actions order.

**Options:**

| Name | Value | Description
|-|-|-
| CREATE_ASSET | 1 | Create a new asset.
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

### Create asset action

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| assetImprint | [required] A `string` representing a cryptographic imprint of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.CREATE_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's address.

### Update asset imprint action

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| assetImprint | [required] A `string` representing a cryptographic imprint of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.UPDATE_ASSET_IMPRINT`.
| ledgerId | [required] A `string` representing asset ledger address.

### Set account abilities action

| Property | Description
|-|-
| abilities[] | [required] An array of `AssetLedgerAbility` representing abilities of an account.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.SET_ABILITIES`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's (account of which we are setting abilities) address.

### Transfer asset action

| Property | Description
|-|-
| assetId | [required] A `string` representing an ID of an asset.
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.TRANSFER_ASSET`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's address.
| senderId | A `string` representing the sender's address.

### Transfer value action

| Property | Description
|-|-
| kind | [required] An `integer` number that equals to `ActionsOrderActionKind.TRANSFER_VALUE`.
| ledgerId | [required] A `string` representing asset ledger address.
| receiverId | A `string` representing the receiver's address.
| senderId | A `string` representing the sender's address.
| value | [required] A big number `string` representing the transferred amount.

## Public addresses

This are latest addresses that work with version 1.5.0. For older addresses that may not be fully compatible with 1.5.0 check under archive.

### Mainnet

| Contract | Address
|-|-
| ActionsGateway | [0x20149E6633706Ff7AA8dD65a49a991fbdfc48460](https://etherscan.io/address/0x20149E6633706Ff7AA8dD65a49a991fbdfc48460)
| TokenTransferProxy | [0xcadd178eb978B07B19C8c7F04A54fa337D9c4d8c](https://etherscan.io/address/0xcadd178eb978b07b19c8c7f04a54fa337d9c4d8c)
| NFTokenTransferProxy | [0x28386bCdC913A0f5639C6ae70FF46E7BaCbB207D](https://etherscan.io/address/0x28386bCdC913A0f5639C6ae70FF46E7BaCbB207D)
| NFTokenSafeTransferProxy | [0x4FE96F8b4C6Cfa819A4162AC4630787c191471e4](https://etherscan.io/address/0x4FE96F8b4C6Cfa819A4162AC4630787c191471e4)
| XcertCreateProxy | [0x730dc765471340f68774A415E15f1cBc06d37BCE](https://etherscan.io/address/0x730dc765471340f68774A415E15f1cBc06d37BCE)
| XcertUpdateProxy | [0xd0A87c106C3Cb3be6662f0BC02d3E86F2BC7c170](https://etherscan.io/address/0xd0A87c106C3Cb3be6662f0BC02d3E86F2BC7c170)


### Ropsten

| Contract | Address
|-|-
| ActionsGateway | [0x0e4f45ad9bca9f214e73683f734f5b1aa3a4051a](https://ropsten.etherscan.io/address/0x0e4f45ad9bca9f214e73683f734f5b1aa3a4051a)
| TokenTransferProxy | [0x61B47772Fd1f98D88dfE887af7F897F0e403aC10](https://ropsten.etherscan.io/address/0x61b47772fd1f98d88dfe887af7f897f0e403ac10)
| NFTokenTransferProxy | [0x41F8e2f78D930259a03A348713879a79736fC57c](https://ropsten.etherscan.io/address/0x41f8e2f78d930259a03a348713879a79736fc57c)
| NFTokenSafeTransferProxy | [0x25ac60fBD008577Bdea7cdB5ec6388D6f21546B0](https://ropsten.etherscan.io/address/0x25ac60fbd008577bdea7cdb5ec6388d6f21546b0)
| XcertCreateProxy | [0x0eb7913c496c9f41f56f1e24b01a170fc7e8f0ff](https://ropsten.etherscan.io/address/0x0eb7913c496c9f41f56f1e24b01a170fc7e8f0ff)
| XcertUpdateProxy | [0x1a05a5139d2e7cf410dd642567211b568f83f221](https://ropsten.etherscan.io/address/0x1a05a5139d2e7cf410dd642567211b568f83f221)

### Rinkeby

| Contract | Address
|-|-
| ActionsGateway | [0x1707f3e4cbfa103cbf51cbbc129ef70123e41d28](https://rinkeby.etherscan.io/address/0x1707f3e4cbfa103cbf51cbbc129ef70123e41d28)
| TokenTransferProxy | [0x4BCA0E94239504e69bC25a3Ef3C5Ca6D80157c3D](https://rinkeby.etherscan.io/address/0x4bca0e94239504e69bc25a3ef3c5ca6d80157c3d)
| NFTokenTransferProxy | [0x0a02d630669C75d5E162AEC89e6adcCF8eC1b475](https://rinkeby.etherscan.io/address/0x0a02d630669c75d5e162aec89e6adccf8ec1b475)
| NFTokenSafeTransferProxy | [0x15731d295aee0B1631995aB19e350e0eDC5691F6](https://rinkeby.etherscan.io/address/0x15731d295aee0b1631995ab19e350e0edc5691f6)
| XcertCreateProxy | [0x67E20dd951Ef09AE6aEbd7c39903F89B2aBD4C79](https://rinkeby.etherscan.io/address/0x67e20dd951ef09ae6aebd7c39903f89b2abd4c79)
| XcertUpdateProxy | [0x0ec6d078e9fd8290b0f990701f1cd9a45d5254a3](https://rinkeby.etherscan.io/address/0x0ec6d078e9fd8290b0f990701f1cd9a45d5254a3)

### Archive

#### 1.0.0 - 1.4.0

##### Mainnet

| Contract | Address
|-|-
| ActionsGateway | [0x7b220AC85B7ae8Af1CECCC44e183A862dA2eD517](https://etherscan.io/address/0x7b220ac85b7ae8af1ceccc44e183a862da2ed517)
| TokenTransferProxy | [0xcadd178eb978B07B19C8c7F04A54fa337D9c4d8c](https://etherscan.io/address/0xcadd178eb978b07b19c8c7f04a54fa337d9c4d8c)
| NFTokenTransferProxy | [0x28386bCdC913A0f5639C6ae70FF46E7BaCbB207D](https://etherscan.io/address/0x28386bCdC913A0f5639C6ae70FF46E7BaCbB207D)
| NFTokenSafeTransferProxy | [0x4FE96F8b4C6Cfa819A4162AC4630787c191471e4](https://etherscan.io/address/0x4FE96F8b4C6Cfa819A4162AC4630787c191471e4)
| XcertCreateProxy | [0x730dc765471340f68774A415E15f1cBc06d37BCE](https://etherscan.io/address/0x730dc765471340f68774A415E15f1cBc06d37BCE)

##### Ropsten

| Contract | Address
|-|-
| ActionsGateway | [0x28dDb78095cf42081B9393F263E8b70BffCbF88F](https://ropsten.etherscan.io/address/0x28ddb78095cf42081b9393f263e8b70bffcbf88f)
| TokenTransferProxy | [0x61B47772Fd1f98D88dfE887af7F897F0e403aC10](https://ropsten.etherscan.io/address/0x61b47772fd1f98d88dfe887af7f897f0e403ac10)
| NFTokenTransferProxy | [0x41F8e2f78D930259a03A348713879a79736fC57c](https://ropsten.etherscan.io/address/0x41f8e2f78d930259a03a348713879a79736fc57c)
| NFTokenSafeTransferProxy | [0x25ac60fBD008577Bdea7cdB5ec6388D6f21546B0](https://ropsten.etherscan.io/address/0x25ac60fbd008577bdea7cdb5ec6388d6f21546b0)
| XcertCreateProxy | [0x0eb7913c496c9f41f56f1e24b01a170fc7e8f0ff](https://ropsten.etherscan.io/address/0x0eb7913c496c9f41f56f1e24b01a170fc7e8f0ff)

##### Rinkeby

| Contract | Address
|-|-
| ActionsGateway | [0x1d57b453DF7483C4b16C0ea67a12C8D2F4133d7f](https://rinkeby.etherscan.io/address/0x1d57b453df7483c4b16c0ea67a12c8d2f4133d7f)
| TokenTransferProxy | [0x4BCA0E94239504e69bC25a3Ef3C5Ca6D80157c3D](https://rinkeby.etherscan.io/address/0x4bca0e94239504e69bc25a3ef3c5ca6d80157c3d)
| NFTokenTransferProxy | [0x0a02d630669C75d5E162AEC89e6adcCF8eC1b475](https://rinkeby.etherscan.io/address/0x0a02d630669c75d5e162aec89e6adccf8ec1b475)
| NFTokenSafeTransferProxy | [0x15731d295aee0B1631995aB19e350e0eDC5691F6](https://rinkeby.etherscan.io/address/0x15731d295aee0b1631995ab19e350e0edc5691f6)
| XcertCreateProxy | [0x67E20dd951Ef09AE6aEbd7c39903F89B2aBD4C79](https://rinkeby.etherscan.io/address/0x67e20dd951ef09ae6aebd7c39903f89b2abd4c79)
