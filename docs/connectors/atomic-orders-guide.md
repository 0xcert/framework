# Atomic orders

If you want to exchange assets with someone in a trustless way, not depending on a third party nor accepting counterparty risk, atomic orders are the way to go.

Atomic order is a way of creating an [atomic swap](https://0xcert.org/news/dex-series-7-atomic-swaps/) within the 0xcert Framework. It is a set of instructions for what you will execute in a single mutation and with only two possible results. Either the mutation will succeed and all participants will receive their assets, or the mutation will fail and the operation will return to its starting point.

Atomic orders can be performed between multiple parties and can contain multiple actions. 

List of available actions:
- Transfer asset
- Transfer value
- Create new asset
- Update existing asset imprint
- Destroy an asset
- Update account abilities

Because atomic orders can be between multiple parties there are 4 different ways of how to interact with them. In this guide we will go trough all of them and explain each and everyone. But here you can see a quick overview: 
- `FixedActionsOrder` - All participants are known and set in the order. Only the last defined participant can peform the order, others have to provide signatures.
- `SignedFixedActionsOrder` - All participants are known and set in the order. All participants have to provide signatures. Anyone can perform the order.
- `DynamicActionsOrder` - The last participant can be an unknown - "any". All defined participants have to provide signatures, anyone can peform the order and he automatically becomes the last participant.
- `SignedDynamicActionsOrder` - The last participant can be an unknown - "any". All defined participants have to provide signatures as well as the last "any" participant. Anyone can then perform the order if he has all the signatures.

::: card More about atomic swaps
For more information on the actual process of atomic operation, please check [this article](https://0xcert.org/news/dex-series-7-atomic-swaps/).
:::

## Gateway 

All atomic orders in 0xcert framework are performed through `Gateway` package. `Gateway` package is as the name suggests the gateway to multiple smart contract that already live (and are maintained by 0xcert) on the blockchain that make atomic swaps with such broad functionalites possible. There are multiple main smart contracts depending on what kind of atomic order we are performing as well as multiple proxies that take care of specific actions. [Here]() you can see all deployed smart contracts and their addresses. 

Since `Gateway` is a single point of entry for all kinds of atomic orders each order is defined trough a `Order` interace and has a unique `OrderKind` to differentiate them.

To start the guide off we will create a `FixedActionsOrder` since it is the simplest.

## Prequisites

In this guide we will assume you have gone trough the [Asset Management]() guide and have an `AssetLedger` deployed as well an asset with id `100` created. You will also need three Metamask accounts(create them trough your metamask plugin) that all have some ETH available.

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

`getGatewayConfig` wil always return the latest contract versions for specific package version. You can also configure gateway config on your own using our already deployed addresses from [here]() or with your own addreses.

## Fixed actions order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-fixed-actions-order?module=%2FREADME.md) to check the live example for fixed actions order.
:::

We will have two participants, one will be the account we used for creating the `AssetLedger` the other will be a second account from the metamask. For simplicity lets name them account1 and account2.

We will create a fixed actions order with two actions. First action will be transfer of our already created asset with ID `100` from account1 to account2. Another is that we will create a new asset with ID `101` to account2.

First we start with defining the order.

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

In the order we are creating a new asset and transfering an existing one. But this actions first require our approval. So we will first give approval for asset transfer. For this we will make an instance of `AssetLedger` like we learned in [Asset Management guide]() and set gateway proxy as an operator.

```ts
const transferProxy = await gateway.getProxyAccountId(ProxyKind.TRANSFER_ASSET);
const mutation = await assetLedger.approveOperator(transferProxy);
await mutation.complete();
```

Then we will give create proxy the permission to create a new asset in our name.

```ts
const createProxy = await gateway.getProxyAccountId(ProxyKind.CREATE_ASSET);
const mutation = await assetLedger.grantAbilities(createProxy, [GeneralAssetLedgerAbility.CREATE_ASSET]);
await mutation.complete();
```

::: tip
Don't forget to create an instance of `assetLedger` and to import `GeneralAssetLedgerAbility`.
:::

We only need to grant permissions and set operator the first time (per ledger).

Now since there are two participants (`signers`) this means that the first one has to sign the order while the second one can perform it.
Meaning you have to have account1 selected in the metamask when signing.

```ts
const signature = await gateway.sign(order); 
```

The first participant can now send his signature and order definition to second participant through arbitrary channels.
When the second participant (account2) receives this data he can perform it.

```ts
const mutation = await gateway.perform(order, [signature]);
await mutation.complete();
```

If we did everything correct the atomic swap will peform succesfully otherwise an error will be thrown telling us what went wrong.

## Signed fixed actions order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-signed-fixed-actions-order?module=%2FREADME.md) to check the live example for signed fixed actions order.
:::

The same way as in fixed actions order we will also have two participants and we will create an asset with id `101` and transfer an existing asset with id `100`. 

::: tip
If you already transfered and creates an asset in the previous section on this specific `AssetLedger` then you will not be able to do the same again since account1 is no longer the owner of asset `100` and asset `101` is already created. You can either deploy a new `AssetLedger` and recreate the same starting conditions or send asset `100` back to account 1 and instead of creating asset `101` create an asset `102`.
:::

The order will be defined almost the same as with a fixed order but the execution process will be different. We will only showcase the differences between fixed action order and signed fixed action order.

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

The way we grant permissions stays the same as in the guide above. 

The difference now comes in signing the order. In the case above only the first participant needed to sign the order and the second one could then execute it. While in this case both need to sign the order and anyone can execute the order.

```ts
const signatureFromAccount1 = await gateway.sign(order); // sign with account1 in metamask
const signatureFromAccount2 = await gateway.sign(order); // sign with account2 in metamask
```

::: tip
If you are not using `MetamaskProvider` where you only need to change the account in the metamask extension you will need to create two providers with different default accounts and two gateways each with a different provider for signatures to be made from different accounts.
:::

Now anyone that posses both signatures can execute this order:

```ts
const mutation = await gateway.perform(order, [signatureFromAccount1, signatureFromAccount2]); // perform with account3 in metamask
await mutation.complete();
```

## Dynamic actions order

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-dynamic-actions-order?module=%2FREADME.md) to check the live example for dynamic actions order.
:::

The difference between fixes and dynamic actions order is in knowing the participants beforehand. In the fixed order we had to specify both participants when defining an order as well as the senderId and receiverId in both actions. But dynamic orders allows an undefined participant. Meaning that anyone can become that last participant and automatically becomes either the `senderId` or `receiverId` in actions if they are `undefined`. This allows us to make marketplace like order where for example you can say that you are selling an asset to anyone who is willing to pay some value for it.

For this guide however we will be using the same scenario as in previous guides.

::: tip
If you already transfered and creates an asset in the previous section on this specific `AssetLedger` then you will not be able to do the same again since account1 is no longer the owner of asset `100` and asset `101` is already created. You can either deploy a new `AssetLedger` and recreate the same starting conditions or send asset `100` back to account 1 and instead of creating asset `101` create an asset `102`.
:::

Now to define the order. Unlike fixed order we will only define only one signer and will not define `receiverId` in actions.

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

We still need to grant permission the same way as in previous guides and the specified signer needs to sign the order.

```ts
const signature = await gateway.sign(order); 
```

Now anyone that has the order definition and order signature from the account 1 can perform the order and will automatically become the last participant and receiver of both assets.

```ts
const mutation = await gateway.perform(order, [signature]);
await mutation.complete();
```

## Signed dynamic actions order

In the same maner that signed fixed order differentiates with fixed order the signed dynamic order differentiates with dynamic order.
Meaning that instead of anyone beeing able to perform the order and become the receiver anyone can provide the last signature and then anyone with both signatures can execute the order.

So lets define the order.

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

The way we grant permissions stays the same as in the guide above. 

The difference now comes in signing the order. In the case above only the first participant needed to sign the order and anyone could perform it (making him the recipient). In this case both have to sign the order anyone can execute.

```ts
const signatureFromAccount1 = await gateway.sign(order); 
const signatureFromAnyone = await gateway.sign(order); 
```

::: tip
If you are not using `MetamaskProvider` where you only need to change the account in the metamask extension you will need to create two providers with different default accounts and two gateways each with a different provider for signatures to be made from different accounts.
:::

Now anyone that posses both signatures can execute this order and whoever is the address that created the second signature will become the receiver.

```ts
const mutation = await gateway.perform(order, [signatureFromAccount1, signatureFromAnyone]);
await mutation.complete();
```
