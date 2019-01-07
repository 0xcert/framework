# Value Management

A value is a representation of a cryptocurrency. It is compliant with the ERC-20 standard for fungible tokens on the Ethereum blockchain. If you would like to operate with ZXC tokens, you would encapsulate that as a value.

When we talk about currency, we talk about value. A value is stored in the structure of a storage called Value Ledger. A Value ledger on the Ethereum blockchain represents a smart contract that complies with the ERC-20 standard. The 0xcert Framework follows this standard and adds some extra functions visible in the [API](https://docs.0xcert.org/api/core.html) section.

## Installation

We recommend you employ the package as an NPM package in your application.

```shell
$ npm i --save @0xcert/ethereum-value-ledger
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host compiled and minimized JavaScript files that you can directly include in your website. Please refer to the [API](https://docs.0xcert.org/api/core.html) section to learn more about value ledger.

## Usage overview

As usual, we begin by importing a module.

```ts
import { ValueLedger } from '@0xcert/ethereum-value-ledger';
```

Let's first deploy a new value ledger to the Ethereum blockchain. If you would like to save some time, you can use the already deployed value ledger `XXX`.

```ts
const mutation = await ValueLedger.deploy(provider, {
    name: 'Utility token',
    symbol: 'UTT',
    decimals: '18',
    supply: '500000000000000000000000000', // 500 mio
}).then(() => {
    return mutation.complete();
});

const valueLedgerId = mutation.receiverId;
```

Now that we have created a new value ledger on the network, we can load its instance.

```ts
const assetLedger = ValueLedger.getInstance(provider, valueLedgerId);
```

First, let's read the ledger data.

```ts
const valueLedgerInfo = await valueLedger.getInfo();
//=> { name, ... }
```

Since we are the ones to deploy the value ledger on the network, we automatically own the whole ledger value supply. In our account, we therefore have the total value of the value ledger, freely available for managing.

First, we make sure that we have two MetaMask accounts open. The example below shows how to transfer a value of `100` to the account with `0x` ID (change this ID to the address of your second Ethereum wallet).

```ts
const mutation = await valueLedger.transfer({
    receiverId: '0x',
    value: '100000000000000000000', // 100
}).then((mutation) => {
    return mutation.complete();
});
```

Finally, verify whether the amount has indeed been transferred to the new wallet.

```ts
const balance = await valueLedger.getBalance('0x...');
//=> 100000000000000000000
```

For more details, please refer to the [API](https://docs.0xcert.org/api/core.html) section.
