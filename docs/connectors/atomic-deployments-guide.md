# Atomic deployments

The main purpose of atomic deployments is to delegate ETH execution to a third party enabling ETH less transactions.

So the difference between doing a normal `AssetLedger`/`ValueLedger` deploy is that in an atomic deploy you specify what kind of ledger you are creating (same as doing a normal deploy) as well as receiver of a value transaction (fee) and who can execute the order (can be set to a direct address or as anyone). This enables deployment in a fashion that user defines deploy order and value transfer of some token and anyone that is willing to execute the deployment for the value fee can do it.

Atomic deployment like atomic orders are created through the `Gateway` which as its name suggests is the gateway to the 0xcert protocol smart contract deployed on the network that enable atomic operations.

Lets check out an example of both atomic deployments.

## Prequisites

In this guide we will assume you have gone trough the [Value Management]() guide and have an `VakueLedger` deployed. You will also need two Metamask accounts(create them trough your metamask plugin) that all have some ETH available.

## Installation

We recommend you employ the package as an NPM package in your application.

```ell
$ npm i --save @0xcert/ethereum-gateway
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that can be directly implemented in your website. Please refer to the [API](/api/core.html) section to learn more about gateway.

## Initialization

As usual, we first import a module into the application. This time, we import the `Gateway` class which represents a wrapper around a specific pre-deployed structure on the Ethereum network.

```ts
import { Gateway } from '@0xcert/ethereum-gateway';
```

Then, we create a new instance of the `Gateway` class with an ID that points to a pre-deployed gateway on the Ethereum Ropsten network (this option can also be configured in the provider).

```ts
const gateway = Gateway.getInstance(provider, getGatewayConfig(NetworkKind.ROPSTEN));
```

`getGatewayConfig` wil always return the latest contract versions for specific package version. If you want to configure gateway config on your own using our already deployed addresses from [here]().

## Asset ledger deploy order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-asset-ledger-deploy-order?module=%2FREADME.md) to check the live example for fixed actions order.
:::

We always have two participants in an deploy order. First is the maker of the order. The one who defines what will happen. The second is the taker who can either be directly specified or left empty to anyone can execute the order. We will give an example of the second option. So lets jump right in an define an deploy order.

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
    schemaId: "9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658", // schemaId calculated trough the certification guide
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

Since we are trasfering some value we also have to approve `Gateway` for transfering it. We do this by calling approveValue upon `ValueLedger` instance of the ledger we are tranfering tokens. We also need to specify the amount of value we are approving for.

::: tip
If we approve for a huge amount of value (max is 2^256-1) then we only need to approve once per ledger since it is not feasable we would every run out of allowance.
:::

```ts
const transferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_TOKEN);
const mutation = await valueLedger.approveValue("100000000000000000000", transferProxy);
await mutation.complete();
```

Now we can sign the order and then send the signature as well as order definition trough arbitrary channels to the account that will execute it.

```ts
const signature = await gateway.sign(order); 
```

In case of out guide we will just switch to another metamask account to execute the order.

```ts
const mutation = await gateway.perform(order, signature);
await mutation.complete();
```

If we did everything correct the atomic swap will peform succesfully otherwise an error will be thrown telling us what went wrong.

## Value ledger deploy order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-value-ledger-deploy-order?module=%2FREADME.md) to check the live example for fixed actions order.
:::

We always have two participants in an deploy order. First is the maker of the order. The one who defines what will happen. The second is the taker who can either be directly specified or left empty to anyone can execute the order. We will give an example of the second option. So lets jump right in an define an deploy order.

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

Since we are trasfering some value we also have to approve `Gateway` for transfering it. We do this by calling approveValue upon `ValueLedger` instance of the ledger we are tranfering tokens. We also need to specify the amount of value we are approving for.

::: tip
If we approve for a huge amount of value (max is 2^256-1) then we only need to approve once per ledger since it is not feasable we would every run out of allowance.
:::

```ts
const transferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_TOKEN);
const mutation = await valueLedger.approveValue("100000000000000000000", transferProxy);
await mutation.complete();
```

Now we can sign the order and then send the signature as well as order definition trough arbitrary channels to the account that will execute it.

```ts
const signature = await gateway.sign(order); 
```

In case of out guide we will just switch to another metamask account to execute the order.

```ts
const mutation = await gateway.perform(order, signature);
await mutation.complete();
```

If we did everything correct the atomic swap will peform succesfully otherwise an error will be thrown telling us what went wrong.
