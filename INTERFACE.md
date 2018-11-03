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
import { Connector } from '@0xcert/web3-connector';

const connector = new Connector();
connector.web3;
connector.makerId;
connector.minterId;
connector.exchangeId;
connector.signMethod;
connector.web3;
await connector.attach({ makerId?, minterId?, exchangeId?, signMethod?, web3? });
await connector.detach();
await connector.sign(data);
```
```ts
import { Folder } from '@0xcert/web3-folder';

const folder = new Folder(connector);
await folder.getAbilities(accountId);
await folder.getCapabilities();
await folder.getInfo();
await folder.getSupply();
await folder.getTransferState();
await folder.assignAbilities(accountId, abilities);
await folder.revokeAbilities(accountId, abilities);
await folder.setTransferState(state);
```
```ts
import { Vault } from '@0xcert/web3-vault';

const vault = await new Vault(vaultId, connector);
await vault.getInfo();
await vault.getSupply();
```
```ts
import { Minter, MinterOrder } from '@0xcert/web3-minter';

const order = new MinterOrder(connector);
order.claim;
order.signature;
order.recipe;
order.populate({ claim?, signature?, recipe? });
order.serialize();
await order.build({ makerId?, takerId, transfers, seed?, expiration? });
await order.sign();

const minter = new Minter(connector);
await minter.perform(order);
await minter.cancel(order);
```
```ts
import { Exchange, ExchangeOrder } from '@0xcert/web3-exchange';

const order = new ExchangeOrder(connector);
order.claim;
order.signature;
order.recipe;
order.populate({ claim?, signature?, recipe? });
order.serialize();
await order.build({ makerId?, takerId, transfers, seed?, expiration? });
await order.sign();

const exchange = new Exchange(connector);
await exchange.perform(order);
await exchange.cancel(order);
```
