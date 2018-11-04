# Interface proposal

## Asset

Read asset on the network.

```ts
const { publicData, publicProof } = await protocol.perform({
  queryId: QueryId.READ_ASSET_DATA,
  folderId: '0x...',
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
const folder = new Folder({ ...context });
folder.on('', () => {}); //Transfer(_from, _to, _tokenId );
folder.on('', () => {}); //Approval(_owner, _approved, _tokenId );
folder.on('', () => {}); //ApprovalForAll(_owner, _operator, _approved );
folder.on('', () => {}); //IsPaused(bool isPaused);
folder.on('', () => {}); //TokenProofUpdate(_tokenId, _proof);
folder.on('', () => {}); //AssignAbility(_target, _ability);
folder.on('', () => {}); //RevokeAbility(_target, _ability);
folder.off('', () => {});
folder.transferFrom({ assetId, makerId, takerId }); // najprej te more approvat, vedno klices safeTransferFrom
folder.burn({ assetId });
folder.revoke({ assetId }); 
folder.mint({ assetId, proof });
folder.updateAssetProof({ assetProof }); // 
folder.updateUriBase({ uriBase }); // setUriBase
folder.getSupply();
folder.getMetadata();
folder.getCapabilities();
folder.isEnabled();
folder.isApproved({ accountId, assetId });
folder.isApprovedForAll(accountId);
folder.isAble({ abilityKind, accountId });
folder.verify({ assetId, data: [{ index, value }] }); // from proof.disclose()
folder.approveForOne(accountId, assetId);
folder.approveForAll(); // setApprovalForAll -> setOperator
folder.revokeAsset(); // revokable
folder.balanceOf(accountId);
folder.ownerOf(assetId);
folder.createAsset(assetId, proof, accountId);
folder.subscribe();
folder.unsubscribe();
```

# Confirmed API

```ts
import { Context } from '@0xcert/web3-context';

const context = new Context({ makerId?, minterId?, exchangeId?, signMethod?, web3? });
context.platform; // web3
await context.attach();
await context.detach();
await context.sign(data);
```
```ts
import { Asset } from '@0xcert/asset';
import { AssetLedger } from '@0xcert/web3-asset-ledger';

const ledger = new AssetLedger(connector, folderId?);
// const registry = AssetLedger.getInstance(connector, folderId?);
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

const ledger = await new ValueLedger(connector, vaultId?);
ledger.platform; // web3
ledger.id;
await ledger.deploy(hash);
await ledger.getInfo();
await ledger.getSupply();
```
```ts
const order = new ExchnageOrder(connector);
order.platform;
order.claim; //
order.signature;
order.recipe;
order.createAsset({ assetId, proof }); // proxy 1
order.createAsset({ assetId, proof });
order.createAsset({ assetId, proof });
order.transferAsset({ from, to, assetId }); // proxy 2
order.transferAsset({ from, to, assetId });
order.transferAsset({ from, to, assetId });
order.transferValue({ from, to, value }); // proxy 3
order.transferValue({ from, to, value }); // proxy 3
order.transferValue({ from, to, value }); // proxy 3
// MAKER
order.generate().sign().serialize(); // => by email to taker
// TAKER
order.populate({ claim?, signature?, recipe?: { makerId?, takerId, actions, seed?, expiration? } });
order.perform();



order.serialize();
await order.build({
  takerId: bob,
  asset: {
    folderId: xcertId,
    assetId: '5',
    proof: 'foo',
  },
  transfers: [
    { folderId: xcertId, senderId: bob, receiverId: sara, assetId: '100' },
  ],
  seed: 1535113220,
  expiration: 1607731200,
});
await order.sign(); // by maker
await order.cancel(); // by maker
await order.exchange(); // by taker
```
```ts
import { Minter, MinterOrder } from '@0xcert/web3-minter';

const order = new MinterOrder(connector);
vault.platform; // web3
order.claim;
order.signature;
order.recipe;
order.populate({ claim?, signature?, recipe? });
order.serialize();
await order.build({ makerId?, takerId, transfers, seed?, expiration? });
await order.sign();

const minter = new Minter(connector);
vault.platform; // web3
await minter.perform(order);
await minter.cancel(order);
```
```ts
import { Exchange, ExchangeOrder } from '@0xcert/web3-exchange';

const order = new ExchangeOrder(connector);
order.claim;
order.signature;
order.recipe;
order.add(Action.TRANSFER_VALUE, { ... });
order.add(Action.TRANSFER_ASSET, { ... });
order.add(Action.CREATE_ASSET, { ... });
order.populate({ claim?, signature?, recipe? });
order.serialize();
await order.build({ makerId?, takerId, transfers, seed?, expiration? });
await order.sign(); // seal!

const exchange = new Exchange(connector);
exchange.on('swap', () => {});
exchange.subscribe();
exchange.unsubscribe();
await exchange.perform(order);
await exchange.cancel(order);
```

# Renaming considerations

`Folder` = AssetContract, Asset
`Vault` = CoinContract, Coin
`Minter` = AssetMinter, AssetOrder
`Exchange` = Exchange, ExchangeOrder

# Assets

## Flow to create an asset

```ts
const storage = new Storage();
const connector = new Connector();
const folder = new Folder(connector, folderId);
const asset = new Asset(schema);
asset.platform;
asset.folderId;
asset.id;
asset.populate(data);
asset.serialize();
try {
  await asset.validate();
  await storage.upload(asset);
  await folder.mint(asset);
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
