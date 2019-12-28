# Atomic deployments

The main purpose of atomic deployments is to delegate ETH execution to a third party enabling ETH-less transactions.

So the difference between doing a normal `AssetLedger`/`ValueLedger` deploy is that in an atomic deploy you specify what kind of ledger you are creating (same as doing a normal deploy), as well as the receiver of a value transaction (fee), and who can execute the order (can be set to a direct address or anyone). This enables deployment in a fashion that the user defines deploy order and value transfer of some token, and anyone willing to execute the deployment for the value fee can do it.

Atomic deployment, like atomic order, is created through the `Gateway`, which, as its name suggests, is the gateway to the 0xcert protocol smart contract, deployed on the network and enabling atomic operations.

Let's check out an example of both atomic deployments.

## Prerequisites

In this guide, we will assume you have gone through the [Value Management]() guide and have a `ValueLedger` deployed. You will also need two MetaMask accounts (create them through your MetaMask plug-in) with some ETH available.

## Installation

We recommend you employ the package as an NPM package in your application.

```ell
$ npm i --save @0xcert/ethereum-gateway
```

In our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that can be directly implemented in your website. Please refer to the [API](/api/core.html) section to learn more about gateway.

## Initialization

As usual, we first import a module into the application. This time, we import the `Gateway` class, which represents a wrapper around a specific pre-deployed structure on the Ethereum network.

```ts
import { Gateway } from '@0xcert/ethereum-gateway';
```

Then, we create a new instance of the `Gateway` class with an ID that points to a pre-deployed gateway on the Ethereum Ropsten network (this option can also be configured in the provider).

```ts
const gateway = Gateway.getInstance(provider, getGatewayConfig(NetworkKind.ROPSTEN));
```

`getGatewayConfig` will always return the latest contract versions for a specific package version. If you want to configure gateway config on your own, you can find our already deployed addresses [here]().

## Asset ledger deploy order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-asset-ledger-deploy-order?module=%2FREADME.md) to check the live example for the fixed actions order.
:::

We always have two participants in a deploy order. The first is the maker of the order, the one who defines what will happen. The second one is the taker, who can either be directly specified or left empty to be filled by anyone who can execute the order. Our example will take the second option. So let's jump right in and define a deploy order.

```ts
const order = {
  kind: OrderKind.ASSET_LEDGER_DEPLOY_ORDER,
  makerId: '0x...', // account1 defining the order
  seed: Date.now(), // unique order identification
  expiration: Date.now() + 86400000, // 1 day
  assetLedgerData: {
    name: "test", // ledger name
    symbol: "TST", // ledger symbol
    uriPrefix: "https://base.com/", // uri template prefix
    uriPostfix: ".json", // uri template prefix
    schemaId: "9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658", // schemaId calculated through the certification guide
    capabilities: [
      AssetLedgerCapability.TOGGLE_TRANSFERS,
      AssetLedgerCapability.DESTROY_ASSET,
    ],
    ownerId: '0x...', // account1 which will get all abilities for this ledger
  },
  tokenTransferData: {
    ledgerId: '0x..', // valueLedgerId that we created in the previous guide
    value: "100000000000000000000" // 100 tokens
  },
} as AssetLedgerDeployOrder;
```

Since we are transferring some value, we also have to approve the `Gateway` for transferring it. We do this by calling approveValue upon the `ValueLedger` instance of the ledger we are transferring tokens from. We also need to specify the amount of value we are approving for transfer.

::: tip
If we approve a huge amount of value (max is 2^256-1), we only need to approve it once per ledger, otherwise we would run out of allowance.
:::

```ts
const transferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_TOKEN);
const mutation = await valueLedger.approveValue("100000000000000000000", transferProxy);
await mutation.complete();
```

Now we can sign the order, and then send the signature, as well as the order definition, through arbitrary channels to the account that will execute it.

```ts
const signature = await gateway.sign(order); 
```

In this guide, we will switch to another MetaMask account to execute the order.

```ts
const mutation = await gateway.perform(order, signature);
await mutation.complete();
```

If we did everything correctly, the atomic swap would perform successfully; otherwise, an error will be thrown, specifying what went wrong.

## Value ledger deploy order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-value-ledger-deploy-order?module=%2FREADME.md) to check the live example for the fixed actions order.
:::

We always have two participants in a deploy order. The first is the maker of the order, the one who defines what will happen. The second one is the taker, who can either be directly specified or left empty to be filled by anyone who can execute the order. Our example will take the second option. So let's jump right in and define a deploy order.

```ts
const order = {
  kind: OrderKind.VALUE_LEDGER_DEPLOY_ORDER,
  makerId: '0x...', // account1 defining the order
  seed: Date.now(), // unique order identification
  expiration: Date.now() + 86400000, // 1 day
   valueLedgerData: {
    name: "test", // ledger name
    symbol: "TST", // ledger symbol
    supply: "5000000000000000000000000", // amount of tokens including the number of decimals, 500 mil in this case
    decimals: "18", // amount of decimals
    ownerId: '0x...', // account1 which will become the owner of the whole token supply
  },
  tokenTransferData: {
    ledgerId: '0x..', // valueLedgerId that we created in the previous guide
    value: "100000000000000000000", // 100 tokens
  },
} as ValueLedgerDeployOrder;
```

Since we are transferring some value, we also have to approve the `Gateway` for transferring it. We do this by calling approveValue upon the `ValueLedger` instance of the ledger we are transferring tokens from. We also need to specify the amount of value we are approving for transfer.

::: tip
If we approve a huge amount of value (max is 2^256-1), we only need to approve it once per ledger, otherwise we would run out of allowance.
:::

```ts
const transferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_TOKEN);
const mutation = await valueLedger.approveValue("100000000000000000000", transferProxy);
await mutation.complete();
```

Now we can sign the order, and then send the signature, as well as the order definition, through arbitrary channels to the account that will execute it.

```ts
const signature = await gateway.sign(order); 
```

In this guide, we will switch to another MetaMask account to execute the order.

```ts
const mutation = await gateway.perform(order, signature);
await mutation.complete();
```

If we did everything correctly, the atomic swap would perform successfully; otherwise, an error will be thrown, specifying what went wrong.
