# Atomic orders

If you want to exchange assets with someone in a trustless way, not depending on a third party nor accepting counterparty risk, atomic orders are the way to go.

Atomic order is a way of creating an [atomic swap](https://0xcert.org/news/dex-series-7-atomic-swaps/) within the 0xcert Framework. It is a set of instructions for what you will execute in a single mutation and with only two possible results: either the mutation will succeed with all actions executed, or the mutation will fail and nothing will change. Atomic order leaves no middle way.

Atomic orders can be performed between multiple parties and can contain multiple actions.

List of available actions:
- Transfer asset
- Transfer value
- Create new asset
- Update existing asset imprint
- Destroy an asset
- Update account abilities

Since atomic orders can be performed between multiple parties, there are four different ways of how to interact with them. In this guide, we will go through all of them and explain each and every one. Here is a quick overview:
- `FixedActionsOrder` - All participants are known and set in the order. Only the last defined participant can perform the order; others have to provide signatures.
- `SignedFixedActionsOrder` - All participants are known and set in the order. All participants have to provide signatures. Anyone can perform the order.
- `DynamicActionsOrder` - The last participant can be unknown or "any". All defined participants have to provide signatures, anyone can perform the order. The one that performs the order, automatically becomes the last participant.
- `SignedDynamicActionsOrder` - The last participant can be unknown or "any". All defined participants have to provide signatures, as well as the last "any" participant. Anyone can then perform the order once all the signatures have been provided.

::: card More about atomic swaps
For more information on the actual process of atomic operation, please check [this article](https://0xcert.org/news/dex-series-7-atomic-swaps/).
:::

## Gateway 

All atomic orders within the 0xcert Framework are performed through a `Gateway`. Gateway is, as the name suggests, the gateway to multiple smart contracts that already live (and are maintained by 0xcert) on the blockchain and that enable atomic swaps with a broad array of functionalities. Depending on what kind of atomic order we are performing, there are multiple main smart contracts, as well as multiple proxies that take care of specific actions. [Here](), you can see all the already deployed smart contracts and their addresses. 

Since `Gateway` is a single point of entry for all kinds of atomic orders, each order is defined through an `Order` interface and has a unique `OrderKind` for the sake of differentiation.

For the beginning of this guide, we will create a `FixedActionsOrder`, the simplest type of atomic orders.

## Prerequisites

In this guide, we will assume you have gone through the [Asset Management]() guide and have deployed an `AssetLedger`, as well created an asset with ID `100`. You will also need three MetaMask accounts (create them through your MetaMask plug-in) with some ETH available.

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

`getGatewayConfig` will always return the latest contract versions for a specific package version. You can also configure gateway config on your own with our already deployed addresses [here]() or with your own addresses.

## Fixed actions order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-fixed-actions-order?module=%2FREADME.md) to check the live example for the fixed actions order.
:::

We will have two participants; one will be the account we used for creating the `AssetLedger`; the other will be the second account from MetaMask. For simplicity, let's name them account1 and account2.

We will create a fixed actions order with two actions. The first action will be a transfer of our already created asset with ID `100` from account1 to account2. In the second action, we will create a new asset with ID `101` in account2.

First, we start by defining the order.

```ts
const order = {
  kind: OrderKind.FIXED_ACTIONS_ORDER, // defining order kind
  signers: ['0x...', '0x...'], // account1, account2
  seed: Date.now(), // unique order identification
  expiration: Date.now() + 86400000, // 1 day
  actions: [ // actions we want to perform in this order
    {
      kind: ActionsOrderActionKind.TRANSFER_ASSET, // transfer asset action
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      receiverId: '0x..', // account2
      assetId: '100', // asset id
    },
    {
      kind: ActionsOrderActionKind.CREATE_ASSET,
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      receiverId: '0x..', // account2
      assetId: '101', // asset id
      assetImprint: 'c6c14772f269bed1161d4350403f4c867c749b3cce7abe84c6d0605068cd8a87', // asset imprint
    }
  ]
} as FixedActionsOrder
```

In this order, we are creating a new asset and transferring an existing one. But these actions first require our approval. So we will first approve asset transfer. For this, we will make an instance of `AssetLedger` as we learned in the [Asset Management guide]() and set gateway proxy as an operator.

```ts
const transferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_ASSET);
const mutation = await assetLedger.approveOperator(transferProxy);
await mutation.complete();
```

Then, we will grant permission to create proxy to create a new asset on our behalf.

```ts
const createProxy = await gateway.getProxyAccountId(ProxyKind.CREATE_ASSET);
const mutation = await assetLedger.grantAbilities(createProxy, [GeneralAssetLedgerAbility.CREATE_ASSET]);
await mutation.complete();
```

::: tip
Don't forget to create an instance of `assetLedger` and to import `GeneralAssetLedgerAbility`.
:::

Granting permissions and setting the operator is only needed the first time (per ledger).

Now, since we have two participants (`signers`), the first one has to sign the order while the second one can perform it. This means you have to select account1 in MetaMask when signing the order.

```ts
const signature = await gateway.sign(order); 
```

The first participant can now send their signature and the order definition to the second participant through arbitrary channels.
Once the second participant (account2) receives this data, they can perform the order.

```ts
const mutation = await gateway.perform(order, [signature]);
await mutation.complete();
```

If we did everything correctly, the atomic swap would perform successfully; otherwise, an error will be thrown, specifying what went wrong.

## Signed fixed actions order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-signed-fixed-actions-order?module=%2FREADME.md) to check the live example for signed fixed actions order.
:::

Just like in the fixed actions order, we will have two participants. Also, we will create an asset with ID `101` and transfer an existing asset with ID `100`. 

::: tip
If you already transferred and created an asset in the previous section on this specific `AssetLedger`, you will not be able to do the same action again since account1 is no longer the owner of the asset `100` and the asset `101` has already been created. You can either deploy a new `AssetLedger` and recreate the same starting conditions or send the asset `100` back to account1, and instead of creating the asset `101`, you can create an asset with ID `102`.
:::

The order will be defined almost the same way as in the fixed order, however, the execution process will be different. We will only showcase the differences between the fixed action order and the signed fixed action order.

```ts
const order = {
  kind: OrderKind.SIGNED_FIXED_ACTIONS_ORDER, // defining order kind
  signers: ['0x...', '0x...'], // account1, account2
  seed: Date.now(), // unique order identification
  expiration: Date.now() + 86400000, // 1 day
  actions: [ // actions we want to perform in this order
    {
      kind: ActionsOrderActionKind.TRANSFER_ASSET, // transfer asset action
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      receiverId: '0x..', // account2
      assetId: '100', // asset id
    },
    {
      kind: ActionsOrderActionKind.CREATE_ASSET,
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      receiverId: '0x..', // account2
      assetId: '101', // asset id
      assetImprint: 'c6c14772f269bed1161d4350403f4c867c749b3cce7abe84c6d0605068cd8a87', // asset imprint
    }
  ]
} as SignedFixedActionsOrder
```

The way we grant permissions remains the same as in the guide above.

The difference now comes in signing the order. In the case above, only the first participant was needed to sign the order, and the second one could execute it. In this case, however, both participants need to sign the order, and any participant can execute the order.

```ts
const signatureFromAccount1 = await gateway.sign(order); // sign with account1 in metamask
const signatureFromAccount2 = await gateway.sign(order); // sign with account2 in metamask
```

::: tip
If you are not using `MetamaskProvider` where you only need to change the account in the MetaMask extension, you will need to create two providers with different default accounts, as well as two gateways, each with a different provider for signatures to be made from different accounts.
:::

Now anyone that has both signatures can execute this order:

```ts
const mutation = await gateway.perform(order, [signatureFromAccount1, signatureFromAccount2]); // perform with account3 in metamask
await mutation.complete();
```

## Dynamic actions order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-dynamic-actions-order?module=%2FREADME.md) to check the live example for dynamic actions order.
:::

The difference between the fixed and the dynamic actions order is in knowing the participants beforehand. In the fixed order at defining the order, we had to specify both participants, as well as the senderId and receiverId in both actions. On the other hand, dynamic orders allow for an undefined participant. This means that anyone can become that last participant and automatically become either the `senderId` or `receiverId` in actions if they are `undefined`. This allows us to make a marketplace-like order where, for example, you can say you are selling an asset to anyone willing to pay some value for it.

For this guide, however, we will be using the same scenario as in previous guides.

::: tip
If you already transferred and created an asset in the previous section on this specific `AssetLedger`, you will not be able to do the same action again since account1 is no longer the owner of the asset `100` and the asset `101` has already been created. You can either deploy a new `AssetLedger` and recreate the same starting conditions or send the asset `100` back to account1, and instead of creating the asset `101`, you can create an asset with ID `102`.
:::

Now let's define the order. Unlike the fixed order, we will define only one signer and will not define `receiverId` in actions.

```ts
const order = {
  kind: OrderKind.DYNAMIC_ACTIONS_ORDER, // defining order kind
  signers: ['0x...'], // account1
  seed: Date.now(), // unique order identification
  expiration: Date.now() + 86400000, // 1 day
  actions: [ // actions we want to perform in this order
    {
      kind: ActionsOrderActionKind.TRANSFER_ASSET, // transfer asset action
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      assetId: '100', // asset id
    },
    {
      kind: ActionsOrderActionKind.CREATE_ASSET,
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      assetId: '101', // asset id
      assetImprint: 'c6c14772f269bed1161d4350403f4c867c749b3cce7abe84c6d0605068cd8a87', // asset imprint
    }
  ]
} as DynamicActionsOrder
```

We still need to grant permission the same way as in previous guides, and the specified signer needs to sign the order.

```ts
const signature = await gateway.sign(order); 
```

Now, anyone that has the order definition and the order signature from account1 can perform the order and will automatically become the last participant and receiver of both assets.

```ts
const mutation = await gateway.perform(order, [signature]);
await mutation.complete();
```

## Signed dynamic actions order

Much like a signed fixed order differs from a fixed order, the signed dynamic order differs from a dynamic order.
This means that instead of any participant being able to perform the order and become the receiver, any participant can provide the last signature, and anyone with both signatures can execute the order.

So let's define the order.

```ts
const order = {
  kind: OrderKind.SIGNED_DYNAMIC_ACTIONS_ORDER, // defining order kind
  signers: ['0x...'], // account1
  seed: Date.now(), // unique order identification
  expiration: Date.now() + 86400000, // 1 day
  actions: [ // actions we want to perform in this order
    {
      kind: ActionsOrderActionKind.TRANSFER_ASSET, // transfer asset action
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      assetId: '100', // asset id
    },
    {
      kind: ActionsOrderActionKind.CREATE_ASSET,
      ledgerId: '0x..', // assetLedgerId that we created in the previous guide
      senderId: '0x..', // account1
      assetId: '101', // asset id
      assetImprint: 'c6c14772f269bed1161d4350403f4c867c749b3cce7abe84c6d0605068cd8a87', // asset imprint
    }
  ]
} as SignedDynamicActionsOrder
```

The way we grant permissions remains the same as in the guide above. 

The difference now comes in signing the order. In the case above, only the first participant was needed to sign the order, and any participant could execute it (making them the recipient). In this case, however, both participants need to sign the order, and any participant can execute the order.

```ts
const signatureFromAccount1 = await gateway.sign(order); 
const signatureFromAnyone = await gateway.sign(order); 
```

::: tip
If you are not using `MetamaskProvider` where you only need to change the account in the MetaMask extension, you will need to create two providers with different default accounts, as well as two gateways, each with a different provider for signatures to be made from different accounts.
:::

Now, anyone that has both signatures can execute this order, and the participant with the address that created the second signature will become the receiver.

```ts
const mutation = await gateway.perform(order, [signatureFromAccount1, signatureFromAnyone]);
await mutation.complete();
```
