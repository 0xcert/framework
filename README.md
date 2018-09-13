# 0xcert suite

## Overview

Connector definira nacin komunikacije oz. platformo (npr. Ethereum, Wanchain).

```ts
import { EthereumMetamaskConnector } from '@0xcert/connector-ethereum-metamask';

const connector = new EthereumMetamaskConnector();
```

Vsak uporabnik je v sistemu identificiran kot account.

```ts
import { Account } from '@0xcert/core';

const bob = new Account({
  connector,
  address: '0x...',
});
const jane = new Account({
  connector,
  address: '0x...',
});
const john = new Account({
  connector,
  address: '0x...',
});
```

Vsak asset pripada kontekstu, ki ga imenujemo folder. Ta definira vrsto smart contracta (e.g. ERC721, ERC20). Asset predstavlja vsebino konteksta (e.g. 1 cryptokitty).

```ts
import { Folder, Asset } from '@0xcert/core';
import IDENTITY_ASSET_SCHEMA from '@0xcert/schemas/assets/identity';

const folder = new Folder({
  connector,
  schema: IDENTITY_ASSET_SCHEMA,
});
const asset = new Asset({
  folder,
});
```

Vsak coin pripada kontekstu, ki ga imenujemo `vault`. Asset predstavlja vsebino trezorja token.

```ts
import { Vault, Coin } from '@0xcert/core';
import ARAGON_COIN_SCHEMA from '@0xcert/schemas/coins/aragon';

const vault = new Vault({
  connector,
  schema: ARAGON_COIN_SCHEMA,
});
const coin = new Coin({
  vault,
});
```

Minter omogoca ustvarjanje novega Asseta direktno na ERC721 contractu oz. preko decentraliziranega minterja. Minter je prednastavljen z ustreznimi podatki do proxyjev.

```ts
import { Minter } from '@0xcert/core';

const minter = new Minter({
  connector,
});
```

Exchange je namenjen izmenjavi razlicnih Assetov in Coinov in to z razlicnimi contexti.

```ts
import { Exchange } from '@0xcert/core';

const exchange = new Exchange({
  connector,
});
```

## Minter

Pred prvo uporabo mora owner ERC721 contracta pooblastiti minterjev proxy da lahko minter izvaja ukaze na contractu v imenu ownerja.

```ts
folder.authorizeMint(minter)
```

Novi Asseti se zmintajo preko Minter contractov v atomicni operaciji.

```ts
const asset = new Assat({
  folder,
  id: 100,
  url: 'http://neki.com',
  data: [],
});
minter.mint({
  maker: bob,
  taker: jane,
  asset,
  transfers: [
    { from: bob, to: jane, asset } as Transfer,
    { from: bob, to: jane, coin, value: 300 } as Transfer, // `from` je lahko le maker ali taker
    { from: jane, to: john, coin, value: 300 } as Transfer, // `to` je lahko poljuben account
  ],
  seed: Date.now(),
  expires: new Date('2019-10-01'),
});
```

## Exchange

Pred prvo uporabo mora holder ERC721 tokenov approvati DEX proxy da lahko transferira tokene v imenu holderja.

```ts
folder.approveAll(who) // aprovaj katerega koli kriptokitija ki ga imam v denarnici
folder.approveOne(who, id) // approvaj le izbranega kriptokitija ki ga imam v denarnici
```

Enako velja za ERC20 tokene, kjer mora holder tokenov approvat DEX proxy da lahko transferira doloceno kolicino coinov v imenu holderja.

```ts
vault.approveAmount(amount, who) // aprovaj doloceno kolicino tokenov ki jih imam v denarnici
```

ERC721 in ERC20 tokeni se transferirajo v atomicni operaciji.

```ts
import { Order } from '@0xcert/core';

const order = new Order({
  maker: bob,
  taker: jane,
  transfers: [
    { from: bob, to: jane, asset } as Transfer,
    { from: bob, to: jane, coin, value: 300 } as Transfer, // `from` je lahko le maker ali taker
    { from: jane, to: john, coin, value: 300 } as Transfer, // `to` je lahko poljuben account
  ],
  seed: Date.now(),
  expiration: new Date('2019-01-01'),
});
order.serialize(); // vrne JSON s podatki o orderju in signature (odpre se metamask)
order.populate({ ... }); // nalozi serializiran order (narejen preko serialize())

exchange.perform(order); // perform transaction (can only be made by taker)
exchange.cancel(order); // cancel ordered transaction (can only be done by maker)
```

## Contributing

See [CONTRIBUTING.md](https://github.com/0xcert/suite/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/0xcert/suite/blob/master/LICENCE) for details.
