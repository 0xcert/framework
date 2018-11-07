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

const ledger = new AssetLedger(context, ledgerId?);
ledger.platform;
ledger.id;
ledger.on(event, handler);
ledger.off(event, handler);
ledger.subscribe();
ledger.unsubscribe();
await ledger.deploy(hash);
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

const ledger = await new ValueLedger(context, ledgerId?);
ledger.platform;
ledger.id;
ledger.on(event, handler);
ledger.off(event, handler);
ledger.subscribe();
ledger.unsubscribe();
await ledger.getInfo();
await ledger.getSupply();
```
```ts
import { Order } from '@0xcert/order';

const order = new Order(data);
order.id;
order.folderId;
order.makerId;
order.takerId;
order.actions;
order.seed;
order.expiration;
order.populate({ ... });
order.serialize('record');
order.serialize('claim');
```
```ts
import { OrderExchange } from '@0xcert/web3-order-exchange';

const exchange = new OrderExchange(context);
exchange.on(event, handler);
exchange.off(event, handler);
exchange.subscribe();
exchange.unsubscribe();
await exchange.getInfo();
await exchange.claim(order); // signed claim
await exchange.perform(order, signature); // taker
await exchange.cancel(order); // maker
```
```ts
import { Asset } from '@0xcert/assets';

const asset = new Asset(data);
asset.field0; // custom based on schema
asset.field1; // custom based on schema
asset.field2; // custom based on schema
asset.populate(data); // populatest model fields
asset.serialize(); // JSON with all the fields
asset.serialize('metadata'); // public JSON data
asset.serialize('record'); // private JSON data
asset.serialize('proof'); // JSON for merkle tree
await asset.validate(); // throws on invalid props
```
```ts
import { Imprint } from '@0xcert/certification';

const imprint = new Imprint();
await imprint.certify(asset); // root merkle tree
await imprint.expose(asset, [['name']]); // evidence with merkle values and nodes
await imprint.verify(evidence);
```

# Convention

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "description": "University credential",
  "id": "https://0xcert.org/abi/schemas/zcip-47891",
  "properties": {
    "number": {
      "type": "number",
      "multipleOf": 3,
      "maximum": 10,
      "exclusiveMaximum": 100,
      "minimum": 0,
      "exclusiveMinimum": 0
    },
    "string": {
      "type": "string", // date-time, date, time, email, idn-email, hostname, idn-hostname, ipv4, ipv6, uri, uri-reference, iri, iri-reference, 
      "maxLength": 10,
      "minLength": 10,
      "pattern": "/do/",
      "contentEncoding": "base64",
      "contentMediaType": "image/png"
    },
    "array": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 2,
      "minItems": 1,
      "uniqueItems": true,
      "contains": ""
    },
    "object": {
      "type": "object",
      "properties": {
        "foo": {}
      },
      "required": [""],
      "published": [""],
      "provable": [""]
    },
  },
  "title": "Person",
  "type": "object"
}
```

# Assets usage

Here is an example of a development flow for using Asset class. You start by a plain asset object.

```ts
import { Asset } from '@0xcert/assets';

const asset = new Asset(schema);
asset.id;
asset.proof;
asset.field0; // custom based on schema
asset.field1; // custom based on schema
asset.field2; // custom based on schema
asset.populate(data); // populatest model fields
asset.serialize(); // JSON with all the fields
asset.serialize('published'); // public JSON data
asset.serialize('provable'); // private JSON data
asset.serialize('base'); // only { id, proof }
await asset.validate(); // throws on invalid props
await asset.certify(); // generates proof
```

But this class is very limited when it comes to modelling, type safety, validation, error handling, data manipulation and typescript. The first improvment is to create an interface which describes asset fields.

```ts
interface UserIdentity {
  firstName: string;
  lastName: string;
}
const asset = new Asset<UserIdentity>(schema);
...
```

Some applications will be working with much more complex assets that will require custom validators, special error handling, methods for saving/updating/deleting records in the database, method to RESTful call etc. In this case you will need to extend the Asset class and create your own asset model. This will be the usual flow for specialised applications which offer/mint a specific type of assets (e.g. KYC dApp, CryptoKitties dApp).

```ts
import { Model, prop } from '@0xcert/models';

class UserIdentity extends Model {
  readonly context: Context;

  @prop({ ... })
  public firstName: string;
  @prop({ ... })
  public lastName: string;

  public async save() {
    this.context.mongo.collection('credentials').insert(
      this.serialize()
    );
  }
}
```

This new asset model can now nicely be used in your app (e.g. REST route).

```ts
async function userIdentityRouteHandler(req, res) {
  const identity = new UserIdentity({
    firstName: 'John',
    lastName: 'Smith',
  });
  try {
    await identity.validate(); // magic :)
    await identity.certify(); // create identity.proof
    await identity.save();
  }
  catch (error) {
    await identity.handle(error); // magic :)
  }
  return identity.serialize(); // magic :)
}
```

This is elegant! I’d propose we provide these very common implementations, confirmed by the community, in the framework by default (e.g. CollectibleAsset, IdentityAsset). These could be called `ZCIP-1000` (0xcert improvment proposal).

We can somehow enable JSON schema in a custom model like this:

```ts
import { Schema } from '0xcert/json-schema';
import { Model, prop } from '@0xcert/json-model';

class UserIdentity extends Model {
  readonly context: Context;

  public firstName: string;
  public lastName: string;

  public constructor(schema, context) {
    super(context);

    const schema = new Schema(schema);
    schema.props.forEach((p) = this.defineProp(p));
  }
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
