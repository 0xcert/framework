# Value Management

If we take the example from the [Asset Management guide](), we said that banknotes and coins are not assets since they are fungible (interchangeable while retaining the same value). To describe these kinds of items, we use the term value. Value management is all about managing currencies, tokens, etc.

Fungible tokens are represented on the Ethereum blockchain in the form of the [ERC-20](https://eips.ethereum.org/EIPS/eip-20) standard. This standard defines how the basic smart contract looks like and how each fungible token is specified. The 0xcert Framework allows you to simply create and manage your own fungible tokens.

Much like `AssetLedger` represents non-fungible tokens, a `ValueLedger` represents fungible tokens. Thus, the things we do with or within a `ValueLedger` are directly reflected in the ERC-20 smart contract on the blockchain.

TLDR: A value ledger is a container defining how value is defined on the blockchain. Value is defined as a digital representation of fungible tokens (currency).

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-value-management?module=%2FREADME.md) to check the live example for this section.
:::

## Installation

We recommend you employ the package as an NPM package in your application.

```ell
$ npm i --save @0xcert/ethereum-value-ledger
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that can be directly implemented into your website. Please refer to the [API](/api/core.html) section to learn more about the value ledger.

## Creating a new ValueLedger

We begin by importing the modules.

```ts
import { ValueLedger } from '@0xcert/ethereum-value-ledger';
```

Now let's define the kind of `ValueLedger` we want to deploy.

```ts
const valueLedgerDefinition = {
  name: 'Utility token',
  symbol: 'UTT',
  decimals: '18',
  supply: '500000000000000000000000000', // 500 mio
};
```

Here, we name and set a symbol (ticker) to our value ledger. Then we define the number of decimals we want when dealing with the tokens, and finally, the ledger's supply. When defining supply, we need to be careful to incorporate the number of decimals we defined.

::: tip
The author creating a new `ValueLedger` automatically becomes the owner of its whole supply.
:::

Now we can deploy the value ledger.

```ts
const mutation = await ValueLedger.deploy(provider, valueLedgerDefinition).then((mutation) => {
  return mutation.complete();
});

const valueLedgerId = mutation.receiverId;;
```

Now that we have created a new value ledger on the network, we can load its instance.

```ts
const valueLedger = ValueLedger.getInstance(provider, valueLedgerId);
```

First, let's read the value ledger data to see if everything is as configured.

```ts
const valueLedgerInfo = await valueLedger.getInfo();
//=> { name: 'Utility token', symbol: 'UTT', decimals: '18', supply: '500000000000000000000000000' }
```

## Transfer value

Since we are the owner of all the created value, we can now transfer some value (tokens) to someone else.

```ts
const mutation = await valueLedger.transferValue({
    receiverId: '0x...',
    value: '100000000000000000000', // 100
}).then((mutation) => {
    return mutation.complete();
});
```

All we need to do is specify the `receiverId` with a valid Ethereum wallet address, and enter the amount of `value` we want to send. We have to consider the number of decimals when defining the amount.

We can now verify if the value has been successfully transferred by checking the receiver's balance.

```ts
const balance = await valueLedger.getBalance('0x...');
//=> 100000000000000000000
```

For more details, please refer to the [API](/api/core.html) section.
