# Value Transfer

Value is a representation of a cryptocurrency or fungible token (compliant with the ERC-20 standard on the Ethereum blockchain). So if you would like to operate with ZXC tokens you would encapsulate that as value.

## What you can do with value

### Transfer

If you are the Owner of 5.000 ZXC token you can transfer these tokens to someone else. To be able to transfer the value, you need to know the recipient and the amount you would like to transfer to them.

### Approve

The Owner of tokens can approve someone else for a specific amount. That means he has the same control over that amount as the approved person would have. Transfer of these tokens is freely available so this permission should be used with caution. The Owner can approve/revoke approval at anytime.

## Value Ledger

- Value ledgerjem omogoca upravljanje z valutami.
- gre za ERC-20 smart contract, deployan na ethereum networku.
- Predstavljamo si ga lahko kot banko, ki hrani in omogoca upravljanje s tocno doloceno valuto.
- Vse transakcije se belezijo v tej ala banki.

### Installation

We recommend that in your application you use the package as an NPM package.

```shell
$ npm i --save @0xcert/ethereum-value-ledger
```

We also host compiled and minimized JavaScript file which you can directly include in your website on our official GitHub repository. The package adds the content on the `window.$0xcert` variable. You can use [jsdelivr](https://www.jsdelivr.com) to access these files on your website.

```html
<script src="https://cdn.jsdelivr.net/gh/0xcert/framework/dist/ethereum-value-ledger.min.js" />
```

### Usage

Kot obicajno zacnemo z importanjem paketa.

```ts
import { ValueLedger } from '@0xcert/ethereum-value-ledger';
```

Dejmo najprej deployat nov value ledger to Ethereum blockchain. Ce se vam ne da tega delat, mate na voljo already deployed value ledger `XXX`.

```ts
const mutation = await ValueLedger.deploy(provider, {
    name: 'Certificate',
    symbol: 'CERT',
    decimals: '18',
    supply: '500000000000000000000000000', // 500 mio
}).then(() => {
    return mutation.resolve();
});

const valueLedgerId = mutation.receiverId;
```

Zdej ko smo ustvarili nov value ledger na networku, lahko nalozimo njegovo instanco.

```ts
const assetLedger = ValueLedger.getInstance(provider, valueLedgerId);
```

Za zacetek preberimo podatke ledgerja.

```ts
const valueLedgerInfo = await valueLedger.getInfo();
//=> { name, ... }
```

Ker smo mi tisti, ki smo deployali value ledger na network, avtomaticno ownamo celoten ledger value supply. Na nasem racunu je torej celotna vrednost value ledgerja, s katero lahko prosto razpolagamo. Naprej poskrbimo, da imamo v Metamasku 2 racuna. Spodnji primer prikazuje, kako prenesemo 100 value to account with ID `0x` (spremenite ta ID na address svoje druge Ethereum denarnice).

```ts
const mutation = await valueLedger.transfer({
    receiverId: '0x',
    value: '100000000000000000000', // 100
}).then((mutation) => {
    return mutation.resolve();
});
```

Preveri, ce so sredstvar res v novi denarnici.

```ts
const balance = await valueLedger.getBalance('0x...');
//=> 100000000000000000000
```
