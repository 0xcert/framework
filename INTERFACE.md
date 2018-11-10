# Confirmed API

```ts
import { Context } from '@0xcert/web3-context';

const context = new Context({ makerId? exchangeId?, signMethod?, web3? });
context.platform;
await context.attach();
await context.detach();
await context.sign(data);
```
```ts
import { AssetLedger } from '@0xcert/web3-asset-ledger';

const ledger = new AssetLedger(context, ledgerId);
ledger.platform;
ledger.id; // contract address
ledger.on(event, handler);
ledger.off(event, handler);
ledger.subscribe();
ledger.unsubscribe();
await ledger.getAbilities(accountId);
await ledger.getCapabilities();
await ledger.getInfo();
await ledger.getSupply();
await ledger.getTransferState();
await ledger.assignAbilities(accountId, abilities);
await ledger.revokeAbilities(accountId, abilities);
await ledger.setTransferState(state);
await ledger.transfer(to, assetid);
await ledger.mint(assetId, proof);
```
```ts
import { ValueLedger } from '@0xcert/web3-value-ledger';

const ledger = await new ValueLedger(context, ledgerId);
ledger.platform;
ledger.id; // contract address
ledger.on(event, handler);
ledger.off(event, handler);
ledger.subscribe();
ledger.unsubscribe();
await ledger.getInfo();
await ledger.getSupply();
```
```ts
import { OrderInterface, KittyInterface } from '@0xcert/assets';

const order = {
  $schema: 'http...',
  $evidence: 'http...',
  id: '100',
  folderId: '0x...',
  makerId: '0x...',
  takerId: '0x...',
  actions: [],
  seed: 1234,
  expiration: 5678,
} as OrderInterface;

const asset = {
  $schema: 'http...',
  $evidence: 'http...',
  name: '',
  description: '',
  image: '',
} as KittyInterface;
```
```ts
import { OrderExchange } from '@0xcert/web3-order-exchange';

const exchange = new OrderExchange(context);
exchange.on(event, handler);
exchange.off(event, handler);
exchange.subscribe();
exchange.unsubscribe();
await exchange.claim(order); // signed claim (maker)
await exchange.cancel(order); // (maker)
await exchange.perform(order, signature); // (taker)
```
```ts
import { Notary } from '@0xcert/certification';

const notary = new Notary({ algo });
const imprint = await notary.notarize(asset, schema);
const evidence = await notary.expose(asset, schema, strategy); // only evidence
const verified = await notary.verify(asset, schema, evidence, merkleRoot); // verify `asset` based on schema and evidence
// const values = await notary.query(evidence, merkleRoot, selectedPaths);
```

# Schema

```json
{
  "$schema": "",
  "$evidence": "",
  "name": "",
  "description": "",
  "image": ""
}
```

# Asset verification

```ts
// CREATE ASSET
const identity = new UserIdentity({
  id: '100',
  folderId: '0x9128798s9d8g9sd8f7s9d8f7s9d8fs98',
  proof: 'ac9128798s9d8g9sd8f7s9d8f7s9d8fs98',
  firstName: 'John',
  lastName: 'Smith',
});
await identity.validate();
await identity.certify();
identity.freez();

const storage = new Storage();
await storage.createAssetRecord(
  identity.serialize('record')
);
await storage.createMetadataFile(
  identity.serialize('metadata')
);
await ledger.mint(
  identity.serialize('mint')
);
```
```ts
// SERVER
const identity = new UserIdentity();
await identity.populateById('100');
res.json(
  identity.serialize('public')
);
```

# Packages

```ts
// CONTEXT [ok]
[I] Context.Base;

// ASSET [in progress]
[I] Asset.Base;

// ASSET LEDGER [ok]
[I] AssetLedger.Base;
[I] AssetLedger.GetInfoResult;
[E] AssetLedger.Ability;
[E] AssetLedger.Capability;
[E] AssetLedger.TransferState;
[E] AssetLedger.EventName;

// VALUE LEDGER [ok]
[I] ValueLedger.Base;
[I] ValueLedger.GetInfoResult;
[E] ValueLedger.EventName;

// ORDER EXCHANGE [ok]
[I] OrderExchange.Base;
[E] OrderExchange.EventName;

// ORDER [ok]
[I] Order.Base;
[I] Order.Input;
[I] Order.Output;
[I] Order.Action;
[E] Order.Action.Kind;
[I] Order.Action.CreateAsset;
[I] Order.Action.TransferAsset;
[I] Order.Action.TransferValue;

// ?
[I] Connector.Error;
[E] Connector.Issue; // ErrorCode
[I] ConnectorQuery<T>;
[I] ConnectorMutation;
```


















# App Example

```ts
import { Context } from '@0xcert/web3-context';
import { AssetLedger } from '@0xcert/web3-asset-ledger';
import { ValueLedger } from '@0xcert/web3-value-ledger';
import { OrderExchange } from '@0xcert/web3-order-exchange';
import { Order } from '@0xcert/order';
import { CollectibleAsset } from '@0xcert/assets';
import { Footprint } from '@0xcert/certification';

// keep track and watch all performed transactions
const storage = new Storage();
// TODO!!!!!!

// initialize application context
const context = new Context({ storage });

// work with ERC721 smart contract
const assetLedger = new AssetLedger(context, '0x78as78sd7gf87as8f7sd8f7fa');
await assetLedger.getInfo();

// work with ERC20 smart contract
const valueLedger = new ValueLedger(context, '0x78as78sd7gf87as8f7sd8f7fa');
await valueLedger.getInfo();

// generate executable order and send it to a user
const order = new Order({
  makerId: context.myId,
  takerId: '0xa79s87d9s8d7f987192341512',
  actions: [],
  seed: Date.now(),
  expiration: Date.now() * 60 * 24,
});
order.validate();
const orderData = {
  order: order.serialize(),
  signature: contexdt.sign(order.claim()),
};

// execute received executable order
const exchange = new OrderExchange(context);
const mutation = await exchange.perform(
  ...orderData
);

// create new asset and validate the input
const asset = new CollectibleAsset({
  id: null,
  name: 'Superman',
  photo: 'http://super.org/man.jpg',
});
await asset.validate();

// create asset proof
const footprint = new Footprint();
const proof = await footprint.certify(asset);

// generate evidence (values, nodes) with which we can verify the data
const evidence = await footprint.expose(asset, [['book', 'title']]);
await footprint.verify(evidence);

// store it to the database and mint it on the blockchain
await store.createAsset(asset); // you have folderId and an ID
await assetLedger.mint(asset.id, proof);
// you can observe the folder
```
