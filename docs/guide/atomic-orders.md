# Atomic orders

If you want to exchange assets with someone in a trustless way, not depending on a third party nor accepting counterparty risk, atomic orders are the way to go.

Atomic order is a way of creating an atomic swap within the 0xcert Framework. It is a set of instructions for what you will execute in a single mutation and with only two possible results. Either the mutation will succeed and all participants will receive their assets, or the mutation will fail and the operation will return to its starting point.

## How it works

An Atomic swap operation is always an order between a maker and a taker. A maker is the one who creates an order, signs it and sends it to the taker, who in turn executes the order and pays the execution fee. There are two different models when defining an order:

1. You know who will execute the order and you want them any only them to execute it. For example, you want to send a diploma to a specific receiver.
2. You do not care who will execute the order. For example, you are selling a digital artwork to anyone who wants to buy it.

In case 1, both Maker and Taker need to be defined and every action in the order needs to have a sender and receiver.

In case 2, only the Maker is defined, and in the actions either sender or receiver can be left undefined and will automatically be assigned to whoever will perform the action.

![Atomic swap](../assets/atomic-swap.svg)

Multiple actions can be performed in such a manner. Currently supported actions include transferring assets, transferring value, or creating new assets. Using atomic orders provides multiple advantages in addition to trustlessness and safety. You can delegate paying storage fees to another user as well as delegate the time when a mutation should be made.

The 0xcert Framework provides automatization to ensure that a specific agreement among multiple parties is reached. There are only two possible outcomes for an atomic swap:

* Successful completion of the trade for all parties involved; or
* Abolition of the process and returning to the starting point if the swap operation encounters issues in its settlement.

There is no middle ground for an atomic swap's outcome which reduces the possibility of one party taking advantage over the other.

Atomic swaps are performed through the Order Gateway structure which is permanently deployed on the 0xcert platform and is publicly available to everyone. A fixed sequence of required steps and conditions is secured by cryptography embedded in the order gateway. Once all steps are completed, the swap is confirmed and successfully settled. If not, the atomic swap process is abolished and canceled, with no effect on the assets that were subject to swap.

While the trade agreement is created in an off-chain environment between trading parties, the settlement of the trade done by atomic swap is performed entirely on-chain. This makes every single step of the operation trackable and verifiable.

::: card More about atomic swaps
For more information on the actual process of atomic operation, please check [this article](https://0xcert.org/news/dex-series-7-atomic-swaps/).
:::

::: card Learn by example
Click [here](https://stackblitz.com/edit/gateway-example) to check the live example for this section.
:::

## Installation

We recommend you employ the package as an NPM package in your application.

```shell
$ npm i --save @0xcert/ethereum-gateway
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that can be directly implemented in your website. Please refer to the [API](/api/core.html) section to learn more about order gateway.

## Usage overview

To demonstrate the greatness of atomic swap operations, we will transfer an existent asset to a new wallet, then create a new asset and send it to the main wallet. All within a single mutation. First, we will prepare the state that allows us to execute the plan.

These guidelines assume that you have followed the complete guide and taken all the steps from both [Certification](/guide/certification.html) and [Asset management](/guide/asset-management.html) sections, where we created a new asset with the ID `100`. For the purpose of this guide, please make sure you have opened two MetaMask accounts. In this example, we'll name the second account as `0xF9196F9f176fd2eF9243E8960817d5FbE63D79aa`, you may change it if you like.

As usual, we first import a module into the application. This time, we import the `Gateway` class which represents a wrapper around a specific pre-deployed structure on the Ethereum network.

```ts
import { Gateway } from '@0xcert/ethereum-gateway';
```

Then, we create a new instance of the `Gateway` class with an ID that points to a pre-deployed order gateway on the Ethereum Ropsten network (this option can also be configured in the provider).

```ts
const gateway = Gateway.getInstance(provider, getGatewayConfig(NetworkKind.ROPSTEN));
```

Now, we can define an order with two actions: the first action transfers an existing asset that we created in the [Asset management](/guide/asset-management.html) section into our second MetaMask wallet. In the second action, we create a new asset with ID `200` and imprint created in the [Certification](/guide/certification.html) section.

::: warning
For the purpose of simplicity of this guide, we will be both the maker and the taker of the order. For the `makerId` and `takerId`, we will employ our current MetaMask account.
:::

```ts
import { ActionsOrder, ActionsOrderActionKind } from '@0xcert/ethereum-gateway';

const order = {,
    kind: OrderKind.MULTI_ORDER,
    makerId: provider.accountId,
    takerId: provider.accountId,
    actions: [
        {
            kind: ActionsOrderActionKind.TRANSFER_ASSET,
            ledgerId: assetLedgerId,
            senderId: provider.accountId,
            receiverId: provider.accountId,
            assetId: '100',
        },
        {
            kind: ActionsOrderActionKind.CREATE_ASSET,
            ledgerId: assetLedgerId,
            senderId: provider.accountId,
            receiverId: provider.accountId,
            assetId: '200',
            assetImprint: 'aa431acea5ded5d83ea45f1caf39da9783775c8c8c65d30795f41ed6eff45e1b', // imprint generated in the certification step
        },
    ],
    seed: Date.now(), // unique order identification
    expiration: Date.now() + 60 * 60 * 24, // 1 day
} as ActionsOrder;
```

When you work on a real case, make sure to set the `takerId` correctly. If you want your colleague or a third party to execute an order, you should insert their Ethereum wallet address as the `takerId`.

The following step is made only by the maker, i.e. the person who creates an order.

```ts
const signedClaim = await gateway.claim(order);
```

By calling the `claim` function, we sign the order. Now, we need to send this signature to the taker, together with the `order` object via an arbitrary communication channel.

All participants in the order must unlock the transferred assets and allow the `Gateway` to manage them. Make sure this step is done by every party that performs a transfer within order operations. In the example below, we authorize the `Gateway` to transfer the asset with ID `100` to another address and give it the ability to create assets.

The [API](/api/core.html#asset-proof) section contains information about how to authorize the order gateway for all the assets simultaneously, to avoid repeating approval for each individual asset (this is especially useful in the case of a decentralized exchange).

```ts
// approve account for transfering asset
await assetLedger.approveAccount('100', gateway).then((mutation) => {
    return mutation.complete();
});

// assign ability to mint
await assetLedger.grantAbilities(gateway, [GeneralAssetLedgerAbility.CREATE_ASSET]).then((mutation) => {
    return mutation.complete();
});
```
::: tip
Don't forget to create an instance of `assetLedger` and to import `GeneralAssetLedgerAbility`.
:::

::: card Why instance of Gateway?
Gateway is comprised of multiple smart contracts. To save your time from having to know their addresses, we handle it under the hood; however the instance of `Gateway` is required so that we know how to process it. You can also do this manually by finding the exact proxy contracts for the order gateway, but we recommend using `Gateway` instance and let the framework handle it for you.
:::

The following step is done only by the taker, who executes the order on the network and pays the execution fees. For the purpose of this guide, we define the same account for both maker and taker, since we are present on both sides.

```ts
const mutation = await gateway.perform(order, signedClaim).then((mutation) => {
    return mutation.complete();
});
```

By now, the asset with ID `100` should be present in our new wallet, while the main wallet should be left with the new asset with ID `200`.

```ts
const owner100Id = await assetLedger.getAssetAccount('100');
//=> 0x...

const owner200Id = await assetLedger.getAssetAccount('200');
//=> 0x...
```

To learn more about atomic operations on Ethereum, please refer to the [API for Ethereum](/api/ethereum.html#orders-gateway) section. For more information on atomic operations on Wanchain, please refer to the [API for Wanchain](/api/wanchain.html#order-gateway) section.

---

We have now come to the end of our basic guide. Hopefully, you have grasped the basic concepts of the framework, for further information, you may check how the features work in the [API section](/api/core.html).
