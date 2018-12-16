# Atomic Orders

## Order Gateway

- Order gateway je poseben vmesnik na Ethereum blockchainu za atomicno izvajanje orderjev med dvema ali vec osebami.
- V eni atomicni transakciji lahko izvedemo poljudbno stevilo asset transfers, value transfers and asset creatin.

### Installation

We recommend that in your application you use the package as an NPM package.

```shell
$ npm i --save @0xcert/ethereum-order-gateway
```

We also host compiled and minimized JavaScript file which you can directly include in your website on our official GitHub repository. The package adds the content on the `window.$0xcert` variable. You can use [jsdelivr](https://www.jsdelivr.com) to access these files on your website.

```html
<script src="https://cdn.jsdelivr.net/gh/0xcert/framework/dist/ethereum-order-gateway.min.js" />
```

### Usage

Kot vedno najprej importamo ustrezen paket.

```ts
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
```

Za tem pa naredimo instanco.

```ts
const orderGateway = OrderGateway.getInstance(provider);
```

V nadaljevanju bomo ustvarili order, ki bo prenesel asset z IDjem `100`

Define order. Bodi pozoren, da si sledil stepom za asset ledger, ker smo ze zmintali token. Ustvari si dve denarnici, da bos lahko poslal token na drugo.

```ts
import { OrderActionKind } from '@0xcert/ethereum-order-gateway';

const order = {
    makerId: provider.accountId,
    takerId: provider.accountId,
    actions: [
        {
            kind: OrderActionKind.TRANSFER_ASSET,
            ledgerId: assetLedgerId,
            senderId: provider.accountId,
            receiverId: '0x...',
            assetId: '100',
        },
    ],
};
```

NOTES: seed in expiration se zgenerirata sama.

Claim

```ts
const signedClaim = await orderGateway.claim(order);
```

Vsi udelezenci morajo assete, ki jih posiljajo odkleniti in dovoliti OrderGateway da upravlja z njimi. Pazi, da to izvede tako maker kot taker!!!

```ts
const assetLedger = AssetLedger.getInstance(assetLedgerId);
const mutation = await assetLedger.approveAccount(orderGateway, '100');
```

Ta claim sedaj lahko posljes osebi, ki bo zagnala order na networku. V zgornjem primeru si to ti, zato lahko nadaljujes.

Perform

```ts
const mutation = await orderGateway.perform(order, signedClaim);
```

Sedaj lahko preveris, da je bil asset res poslan na novo denarnico.

```ts
// TODO
```