# Interface proposal

## Asset

Read asset on the network.

```ts
const { publicData, publicProof } = await protocol.perform({
  queryId: QueryId.READ_ASSET_DATA,
  ledgerId: '0x...',
  assetId: '0x...',
});
```

Create new asset data with optional exposed field (user can verify the exposes objects from `proofData` and `proofHash`).

```ts
const { privateData, publicData, proofData, proofHash } = await protocol.perform({
  queryId: QueryId.GENERATE_ASSET_DATA,
  conventionId: '187asd...',
  data: {
    firstName: 'John',
    lastName: 'Smith',
    socialSecurity: '187923891',
    documentId: '124123',
  },
  exposePaths: [
    { path: ['firstName'] },
    { path: ['socialSecurity'] },
  ],
});
```

Verify asset data.

```ts
const { isValid } = await protocol.perform({
  queryId: QueryId.VERIFY_ASSET_DATA,
  proofData,
  proofHash,
});
```

Managing assets:

```ts
import { Asset } from '@0xcert/core-assets';

class UserIdentity extends Asset {
  @prop() id: string;
  @prop() firstName: string;
  @prop() lastName: string;
}

const asset = new UserIdentity({ firstName, lastName });
asset.populate({ firstName, lastName });
asset.validate();
asset.serialize();
asset.serialize('public'); 
asset.serialize('private');
asset.proof();
```

Managing proofs:

```ts
import { Proof } from '@0xcert/core-proofs';

const proof = new Proof({ asset });
proof.generate();
proof.verify(proof);
proof.disclose([{ path }]);
```

Connector actions.

```ts
const ledger = new AssetLedger({ ...context });
ledger.on('', () => {}); //Transfer(_from, _to, _tokenId );
ledger.on('', () => {}); //Approval(_owner, _approved, _tokenId );
ledger.on('', () => {}); //ApprovalForAll(_owner, _operator, _approved );
ledger.on('', () => {}); //IsPaused(bool isPaused);
ledger.on('', () => {}); //TokenProofUpdate(_tokenId, _proof);
ledger.on('', () => {}); //AssignAbility(_target, _ability);
ledger.on('', () => {}); //RevokeAbility(_target, _ability);
ledger.off('', () => {});
ledger.transferFrom({ assetId, makerId, takerId }); // najprej te more approvat, vedno klices safeTransferFrom
ledger.burn({ assetId });
ledger.revoke({ assetId }); 
ledger.create({ assetId, proof });
ledger.updateAssetProof({ assetProof }); // 
ledger.updateUriBase({ uriBase }); // setUriBase
ledger.getSupply();
ledger.getMetadata();
ledger.getCapabilities();
ledger.isEnabled();
ledger.isApproved({ accountId, assetId });
ledger.isApprovedForAll(accountId);
ledger.isAble({ abilityKind, accountId });
ledger.verify({ assetId, data: [{ index, value }] }); // from proof.disclose()
ledger.approveForOne(accountId, assetId);
ledger.approveForAll(); // setApprovalForAll -> setOperator
ledger.revokeAsset(); // revokable
ledger.balanceOf(accountId);
ledger.ownerOf(assetId);
ledger.createAsset(assetId, proof, accountId);
ledger.subscribe();
ledger.unsubscribe();
```

# Confirmed API

```ts
import { Context } from '@0xcert/web3-context';

const context = new Context({ makerId? exchangeId?, signMethod?, web3? });
context.platform; // web3
await context.attach();
await context.detach();
await context.sign(data);
```
```ts
import { AssetLedger } from '@0xcert/web3-asset-ledger';


// TODO
- AssetLedger.getInstance
- ledger.id


const ledger = new AssetLedger(context, ledgerId?);
// const registry = AssetLedger.getInstance(context, ledgerId?);
ledger.platform; // web3
ledger.id;
await ledger.deploy(hash);
await ledger.getAbilities(accountId);
await ledger.getCapabilities();
await ledger.getInfo();
await ledger.getSupply();
await ledger.getTransferState();
await ledger.assignAbilities(accountId, abilities);
await ledger.revokeAbilities(accountId, abilities);
await ledger.setTransferState(state);
```
```ts
import { ValueLedger } from '@0xcert/web3-value-ledger';

const ledger = await new ValueLedger(context, ledgerId?);
ledger.platform; // web3
ledger.id;
await ledger.deploy(hash);
await ledger.getInfo();
await ledger.getSupply();
```
```ts
import { Exchange, ExchangeOrder } from '@0xcert/web3-exchange';

const order = new ExchangeOrder(context);
order.claim;
order.signature;
order.recipe;
order.add({ ... });
order.add({ ... });
order.add({ ... });
order.remove({ ... });
order.populate({ makerId?, takerId, actions, seed?, expiration?, signature? });
order.serialize();
await order.sign(); // seal!

const exchange = new Exchange(context);
exchange.on('swap', () => {});
exchange.subscribe();
exchange.unsubscribe();
// await exchange.getInfo();
await exchange.perform(order);
await exchange.cancel(order);
```










# Assets

## Flow to create an asset

```ts
const storage = new Storage();
const context = new Connector();
const ledger = new AssetLedger(context, ledgerId);
const asset = new Asset(schema);
asset.platform;
asset.ledgerId;
asset.id;
asset.populate(data);
asset.serialize();
try {
  await asset.validate();
  await storage.upload(asset);
  await ledger.create(asset);
}
catch (error) {
  alsert(error);
}
```

# Conventions

## JSON Schema

1. Base for conventons.
2. Expend functions by adding `expose: []` for exposing data to public.
3. Convert to schema.org JSON for google search.
4. Must generate private, public, google search objects.





















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
