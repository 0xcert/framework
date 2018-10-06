# 0xcert suite

## Development

Repository management: https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d
Codecov integration: https://gist.github.com/xpepermint/34c1815c2c0eae7aebed58941b16094e

## Overview

### Overview v1

Pregled razredov in funkcij:

```ts
import { Provider } from '@0xcert/web3-provider';
import { Context, Exchange, Minter, Folder, Vault, Asset, Coin, Deal, Recipe, Account } from '@0xcert/core';

const chainProvider = new Web3Provider({
  web3Provider: 'http://localhost:8080',
  xcertMintProxyAddress: '0x...',
  tokenTransferProxyAddress: '0x...',
  nftokenTransferProxyAddress: '0x...',
  exchangeAddress: '0x...',
  minterAddress: '0x...',
});

const context = new Context({
  chainProvider,
  storageProvider,
});

const account = new Account({
  context,
  id: '0x...',
});
account.getBalance(); // returns wallet amount

const folder = new Folder({
  context,
});
folder.getInfo();
folder.getBalance();
folder.authorizeMint(minter); // authorizes minter to execute commands on folder
folder.approveAll(account); // approves all assets to be transfered on-behalf
folder.approveOne(account, asset); // approves selected asset to be transfered on-behalf

const asset = new Asset({
  folder,
});
asset.serialize();
asset.validate();

const vault = new Vault({
  context,
});
vault.approveAll(account); // approves all available amount to be transfered on-behalf
vault.approveAmount(account, 300); // approves amount to be transfered on-behalf

const coin = new Coint({
  vault,
});
asset.serialize();
asset.validate();

const deal = new Deal({
  maker: account,
  taker: account,
  transfers: [
    { from: account, to: account, asset } as Transfer,
    { from: account, to: account, coin, value: 300 } as Transfer, // `from` je lahko le maker ali taker
    { from: account, to: account, coin, value: 300 } as Transfer, // `to` je lahko poljuben account
  ],
  seed: Date.now(),
  expires: new Date('2019-10-01'),
});
const exchange = new Exchange({
  context,
});
exchange.claim(deal); // creates exchange claim
exchange.cancel(deal); // cancele exchange execution
exchange.perform(deal, claim); // executes exchange claim

const recipe = new Recipe({
  maker: account,
  taker: account,
  asset: asset,
  transfers: [
    { from: account, to: account, asset } as Transfer,
    { from: account, to: account, coin, value: 300 } as Transfer, // `from` je lahko le maker ali taker
    { from: account, to: account, coin, value: 300 } as Transfer, // `to` je lahko poljuben account
  ],
  seed: Date.now(),
  expires: new Date('2019-10-01'),
});
const minter = new Minter({
  context,
});
minter.claim(recipe); // creates exchange claim
minter.cancel(recipe); // cancele exchange execution
minter.perform(recipe, claim); // executes exchange claim
```

Connector definira nacin komunikacije oz. platformo (npr. Ethereum, Wanchain).

```ts
import { Web3Connector } from '@0xcert/web3-chain';

const connector = new Web3Connector({
  web3Provider: 'http://localhost:8080',
  xcertMintProxyAddress: '0x...',
  tokenTransferProxyAddress: '0x...',
  nftokenTransferProxyAddress: '0x...',
  exchangeAddress: '0x...',
  minterAddress: '0x...',
});
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

Pred prvo uporabo mora owner ERC721 contracta pooblastiti minterjev proxy da lahko minter izvaja ukaze na contractu v imenu ownerja.

```ts
folder.authorizeMint(minter);
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

### Overview v2

Seznam razredov:

```ts
import { Provider } from '@0xcert/web3-provider';
import { Client, Asset } from '@0xcert/core';

const client = new Client({
  provider: new Provider(),
});

const minter = client.createMint();
minter.claim();                                 // creates mint claim
minter.mint();                                  // executes mint claim
minter.cancel();                                // cancele mint execution

const exchange = client.createExchange();
exchange.claim();                               // creates exchange claim
exchange.exchange();                            // executes exchange claim
exchange.cancel();                              // cancele exchange execution

const account = client.createAccount();         // creates a new wallet
const account = client.loadAccount();           // loads an existing wallet
account.getBalance();                           // returns wallet amount

const folder = client.createFolder();           // create a new folder (deploys smart a new Xcert contract)
const folder = client.loadFolder();             // loads an existing folder (loads Xcert contract)
folder.authorizeMint();                         // authorizes minter to execute commands on folder
folder.approveAll();                            // approves all assets to be transfered on-behalf
folder.approveOne();                            // approves selected asset to be transfered on-behalf

const vault = client.loadVault();               // loads an existing vault (load ERC20 contract)
vault.approveAmount();                          // approves amount to be transfered on-behalf

const asset = new Asset();                      // initializes new asset instance
```

Connector definira nacin komunikacije oz. platformo (npr. Ethereum, Wanchain).

```ts
import { Web3Context } from '@0xcert/web3-context';

const context = new Web3Context({
  web3Provider: 'http://localhost:8080',
  xcertMintProxyAddress: '0x...',
  tokenTransferProxyAddress: '0x...',
  nftokenTransferProxyAddress: '0x...',
  exchangeAddress: '0x...',
  minterAddress: '0x...',
});
```

Framework ima centralen vhod.

```ts
import { Client } from '@0xcert/web3-chain';

const client = new Client({
  context,
});
```

Vsak uporabnik je v sistemu identificiran kot account.

```ts
const bob = client.loadAccount({
  id: '0x...',
});
const jane = client.loadAccount({
  id: '0x...',
});
const john = client.loadAccount({
  id: '0x...',
});
```

Vsak asset pripada kontekstu, ki ga imenujemo folder. Ta definira vrsto smart contracta (e.g. ERC721, ERC20). Asset predstavlja vsebino konteksta (e.g. 1 cryptokitty).

```ts
import IDENTITY_ASSET_SCHEMA from '@0xcert/schemas/assets/identity';

const folder = client.loadFolder({
  id: '0x...',
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

const vault = client.loadVault({
  id: '0x...',
  schema: ARAGON_COIN_SCHEMA,
});
const coin = new Coin({
  vault,
});
```

Pred prvo uporabo minterja mora owner ERC721 contracta pooblastiti minterjev proxy da lahko minter izvaja ukaze na contractu v imenu ownerja.

```ts
folder.authorizeMint();
```

Novi Asseti se zmintajo preko Minter contractov v atomicni operaciji.

```ts
const asset = new Assat({
  folder,
  id: 100,
  url: 'http://neki.com',
  data: [],
});
const creation = new Creation({
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
client.mint(creation);
client.cancelMint(creation);
```

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

client.exchange(order); // perform transaction (can only be made by taker)
client.cancelExchange(order); // cancel ordered transaction (can only be done by maker)
```

### Overview (final)

```ts
const conn = new Context({
  chain: new Web3ChainConnector(),
  storage: new IPFStorageConnector(),
  stream: new IPFSStreamConnector(),
});
conn.on(Context.EVENT_NAME, async (event, args) => { ... });
conn.off(Context.EVENT_NAME);

const folder = new Folder(({
  context,
});
folder.on(Context.EVENT_NAME, async () => { ... });
folder.off(Context.EVENT_NAME);
folder.getMetadata();
folder.getSupply();
folder.getAbilities(); // burnable, mutatable
folder.isAuthorizeForOne(account);
folder.isApprovedForAll();
folder.isApprovedForOne();
folder.isPaused();
folder.authorizeOne(account, true);
folder.approveAll(account);
folder.approveOne(account, id);
folder.transfer(account, id);
folder.pause(true);
folder.mint();
folder.burn();
folder.revoke();
folder.update({ proof, uri });
folder.deploy(schema);

const minter = new Minter({
  context,
});
minter.on(Context.EVENT_NAME, async () => { ... });
minter.off(Context.EVENT_NAME);
minter.mint();
minter.perform();
minter.cancel();

const exchange = new Exchange(({
  context,
});
exchange.on(Context.EVENT_NAME, async () => { ... });
exchange.off(Context.EVENT_NAME);
exchange.mint();
exchange.perform();
exchange.cancel();

const asset = new Asset(context, folder);
asset.populate();
asset.serialize();
asset.validate();
```

### Overview 4

```ts
const conn = new Protocol({
  chain: new ChainConnector(),
  storage: new StorageConnector(),
  stream: new StreamConnector(),
});

const { name, symbol } = conn.perform({
  action: Context.READ_FOLDER_METADATA,
  id: '0x000000000101010101001010101'
});


```


## Contributing

See [CONTRIBUTING.md](https://github.com/0xcert/suite/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/0xcert/suite/blob/master/LICENCE) for details.
