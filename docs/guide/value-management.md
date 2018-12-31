# Value Transfer

A value is a representation of a cryptocurrency. This is compliant with the ERC-20 standard of fungible tokens on the Ethereum blockchain. If you would like to operate with ZXC tokens you would encapsulate that as value.

Ko govorimo o currency, govorimo o value. Ta je shranjen v strukturi na storage, ki jo imenujemo Value Ledger. Value ledger na Ethereum blockchain predstavlja smart contract, ki sledi ERC-20 standardu. 0xcert framework temu sledi in doda se nekatere druge funkcije, ki so razvidne iz [API](/). 

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
    return mutation.complete();
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
    return mutation.complete();
});
```

Preveri, ce so sredstvar res v novi denarnici.

```ts
const balance = await valueLedger.getBalance('0x...');
//=> 100000000000000000000
```
