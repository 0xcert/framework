# Interface proposal

```ts
// connector initialization
const connector = new Web3Connector({
  retryGasMultiplier: 1.2,
  requiredConfirmationsCount: 15,
});

// protocol instance initialization
const protocol = new Protocol({ connector });

// folders
const folder = new Folder({ connector });
folder.on('', () => {});
folder.off('', () => {});
folder.subscribe();
```












## Protocol

First initialize the protocol instance.

```ts
import { Connector } from '@0xcert/web3-connector';
import { Store } from '@0xcert/ipfs-store';
import { Protocol, AbilityId, Action, EventId } from '@0xcert/core';

// connector initialization
const connector = new Web3Connector({
  retryGasMultiplier: 1.2,
  requiredConfirmationsCount: 15,
});

// protocol instance initialization
const protocol = new Protocol({ connector });

// app hydration (after browser refresh)
protocol.resolve([
  { intentId: 'hash', request: { ... }, resolve: null },
  { intentId: 'hash', request: { ... }, resolve: { ... } },
  { intentId: null, request: { ... }, resolve: null },
]);

// events
protocol.on('intent', (intent) => { ... });
protocol.on('resolve', (intent) => { ... });
protocol.on('revert', (error, intent) => { ... });

// query
const intent = protocol.prepare({
  queryId: QueryId.FOLDER_CHECK_TRANSFER_STATE,
  folderId: '0x...',
});
const { intentId, request, response } = intent; // Intent
const { intentId, request, response } = await intent.perform(); // IIntentResponse
const { isEnabled } = await intent.resolve(); // IProtocolResponse

// intent access
const intent = protocol.getIntent(intentId);
const { isEnabled } = intent ? await intent.perform() : {};

// Intent related objects

// mutations
const mutation = protocol.perform({
  kind: kind.FOLDER_SET_TRANSFER_STATE
  mutationId: '0x...',
  folderId: '0x...',
  data: {
    isEnabled: true,
  },
});
const { intentId, request } = query; // Intent
const { intentId } = mutation.exec(); // IIntentResponse
const { isEnabled } = await mutation.resolve(); // IProtocolResponse


// retry
const { amount } = await protocol.perform({
  mutationId: QueryId.RETRY_TRANSACTION_COST,
  txId: '0x...',
});
const { txId } = await protocol.perform({
  mutationId: QueryId.RETRY_TRANSACTION,
  txId: '0x...',
});
```

Listen to protocol events.

```ts
protocol.on({
  event: EventId.EVENT_NAME,
  queryId: async () => {},
});
protocol.off({
  eventId: EventId.EVENT_NAME,
});
```

## Folder 

[implemented] Read folder metadata.

```ts
const { name, symbol } = await protocol.perform({
  queryId: QueryId.FOLDER_READ_METADATA,
  folderId: '0x...',
});
```

[implemented] Read folder total supply.

```ts
const { name, symbol, uriRoot } = await protocol.perform({
  queryId: QueryId.FOLDER_READ_SUPPLY,
  folderId: '0x...',
});
```

[implemented] Read folder features.

```ts
const { isBurnable, isMutatable, isPausable, isRevokable } = await protocol.perform({
  queryId: QueryId.FOLDER_READ_CAPABILITIES,
  folderId: '0x...',
});
```

[implemented] Check if the asset transfers are enabled.

```ts
const { isPaused } = await protocol.perform({
  queryId: QueryId.FOLDER_CHECK_TRANSFER_STATE,
  folderId: '0x...',
});
```

[implemented] Check if an account is authorized to perform a certain action.

```ts
const { isAuthorized } = await protocol.perform({
  queryId: QueryId.FOLDER_CHECK_ABILITY,
  folderId: '0x...',
  abilityId: FolderAbilityId.MANAGE_ABILITIES,
  accountId: '0x...',
});
```

[implemented] Start or stop asset transfers.

```ts
const { isPaused } = await protocol.perform({
  queryId: QueryId.FOLDER_SET_TRANSFER_STATE,
  folderId: '0x...',
  isEnabled: true,
});
```

[implemented] Check if an account can operate on behalf of.

```ts
const { isApproved } = await protocol.perform({
  queryId: QueryId.CHECK_FOLDER_TOKEN_APPROVAL,
  folderId: '0x...',
  acountId: '0x...',
  tokenId: '100',
});
```

[implemented] Update folder URI base.

```ts
const { name, symbol, uriRoot } = await protocol.perform({
  queryId: kind.SET_URI_BASE,
  folderId: '0x...',
  data: {
    uriBase: 'http://foobar.com',
  },
});
```




```ts
// done
protocol.createQuery(FOLDER_CHECK_ABILITY, { ... });
protocol.createQuery(FOLDER_CHECK_APPROVAL, { ... });
protocol.createQuery(FOLDER_CHECK_TRANSFER_STATE, { ... });
protocol.createQuery(FOLDER_READ_CAPABILITIES, { ... });
protocol.createQuery(FOLDER_READ_METADATA, { ... });
protocol.createQuery(FOLDER_READ_SUPPLY, { ... });
protocol.createMutation(FOLDER_SET_TRANSFER_STATE, { ... });
protocol.createMutation(FOLDER_SET_URI_BASE, { ... });
protocol.createMutation(FOLDER_CREATE_ASSET, { ... }); //
protocol.generateClaim(MINTER_CREATE_ASSET, { ... });
protocol.generateClaim(EXCHANGE_SWAP, { ... });

// todo
protocol.createMutation(MINTER_PERFORM_CREATE_ASSET_CLAIM, { ... });
protocol.createMutation(MINTER_CANCEL_CREATE_ASSET_CLAIM, { ... });
protocol.createMutation(EXCHANGE_PERFORM_SWAP_CLAIM, { ... });
protocol.createMutation(EXCHANGE_CANCEL_SWAP_CLAIM, { ... });
protocol.createMutation(FOLDER_DEPLOY, { ... });
protocol.createAsset({ ... });
```

















Deploy new folder.

```ts
const { folderId, txId } = await protocol.perform({
  queryId: QueryId.DEPLOY_NEW_FOLDER,
  conventionId: 'dgnjjnsmaa...',
  data: {
    name: 'Foo',
    symbol: 'Bar',
    uriRoot: 'http://foobar.com',
  },
});
```

## Minter

Generate new mint claim with optional transfers.

```ts
const { mintClaim } = await protocol.perform({
  queryId: QueryId.GENERATE_MINT_CLAIM,
  makerId: '0x...',
  takerId: '0x...',
  data: {
    assetId: '412',
    publicProof: 'ffcd12jjd...',
  },
  transfers: [
    { // IAssetTransfer
      senderId: '0x...',
      receiverId: '0x...',
      folderId: '0x...',
      assetId: '100',
    },
    { // ICoinTransfer
      senderId: '0x...',
      receiverId: '0x...',
      vaultId: '0x...',
      amount: 300,
    },
  ],
  seed: Date.now(),
  expiration: new Date('2019-01-01'),
});
```

Execute mint claim on the network.

```ts
const { txId } = await protocol.perform({
  queryId: QueryId.EXECUTE_MINT_CLAIM,
  data: {
    mintClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

Cancel mint claim.

```ts
const { txId } = await protocol.perform({
  queryId: QueryId.CANCEL_MINT_CLAIM,
  data: {
    mintClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

## DEX

Generate new exchange order claim.

```ts
const { exchangeClaim } = await protocol.perform({
  queryId: QueryId.GENERATE_EXCHANGE_CLAIM,
  makerId: '0x...',
  takerId: '0x...',
  transfers: [
    { // IAssetTransfer
      senderId: '0x...',
      receiverId: '0x...',
      folderId: '0x...',
      assetId: '100',
    },
    { // ICoinTransfer
      senderId: '0x...',
      receiverId: '0x...',
      vaultId: '0x...',
      amount: 300,
    },
  ],
  seed: Date.now(),
  expiration: new Date('2019-01-01'),
});
```

Execute exchange claim on the network.

```ts
const { txId } = await protocol.perform({
  queryId: QueryId.EXECUTE_EXCHANGE_CLAIM,
  data: {
    exchangeClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

Cancel exchange claim.

```ts
const { txId } = await protocol.perform({
  queryId: QueryId.CANCEL_EXCHANGE_CLAIM,
  data: {
    exchangeClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

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







// FEATURES:
//
// - List pending transactions ==> ???
// > Generate hash
// > Save to API
// > Send to geth 
// + protocol.getPendingTransactions()
// + protocol.getCompletedTransactions()
// + protocol.on('pendingTransactionsLoaded') ko se browser reloada
// + protocol.on('newPendingTransaction')
// + protocol.on('transactionCompleted')
//
// - Save ERC721 JSON files ==> ???
// - List history events (token minted) ==> API
// - Search history ==> API

// 1. localstorage za shranjevanje pending stransactions + IPFS JSON file



























```ts
// connector initialization
const connector = new Web3Connector({
  retryGasMultiplier: 1.2,
  requiredConfirmationsCount: 15,
});

// protocol instance initialization
const protocol = new Protocol({ connector });

// working with assets
const asset = protocol.createAsset({
  assetKind: AssetKind.USER_IDENTITY,
});
asset.serialize()
asset.validate();

// hydrating pending mutations
store.pendingMutations().forEach(() => {
  const mutation = protocol.createMutation({ mutationId: '0x...', ... });
  await mutation.resolve(() => { ... });
});

// creating and resolving queries and mutations (B)
const mutation = protocol.createMutation({ // new Mutation();
  kind: kind.FOLDER_SET_TRANSFER_STATE,
  mutationId: '0x...', // only when hydrating
  folderId: '0x...',
  isEnabled: true,
});
try {
  await mutation.resolve();
  mutation.unsubscribe();
} catch (e) {
  console.log(e);
}
const query = protocol.createQuery({ // new Query();
  kind: kind.FOLDER_CHECK_TRANSFER_STATE,
  folderId: '0x...',
});
try {
  query.subscribe(async (eventKind, mutation) => {});
  await query.resolve();
  query.unsubscribe();
} catch (e) {
  console.log(e);
}

// creating claims
const claim = protocol.createClaim(ClaimKind.MINTER_CREATE_ASSET, {
  makerId: '0x...',
  takerId: '0x...',
  transfers: [...],
  expiration: Date.now() + 60000,
});
claim.sign();
claim.serialze();
```














```ts
const connector = new Web3Connector({
  retryGasMultiplier: 1.2,
  requiredConfirmationsCount: 15,
});

const protocol = new Protocol({ connector });

const folder = protocol.createFolder(id);
folder.on('transfer', async () => ...);
folder.subscribe();

const query = protocol.createQuery({
  kind: ...
});
query.on('request', async () => ...)
query.on('response', async () => ...)
await query.resolve();

const mutation = protocol.createMutation({
  kind: ...
});
mutation.on('request', async () => ...);
mutation.on('response', async () => ...);
mutation.on('confirmation', async () => ...);
mutation.on('approval', async () => ...);
mutation.on('revert', async () => ...);
await mutation.resolve();
```












Example 2: ---------------------------------------------------------------------

> Managing assets:

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

> Managing proofs:

```ts
import { Proof } from '@0xcert/core-proofs';

const proof = new Proof({ asset });
proof.generate();
proof.verify(proof);
proof.disclose([{ path }]);
```

> Connector actions.

```ts
import { Context, Order, Exchange, Minter } from '@0xcert/web3-connector';

const context = new Context({ approvalConfirmations });

const folder = new Folder({ ...context });
folder.batch([
  folder.mint({ assetId, proof }),
  folder.revoke({ assetId }),
]);
folder.on('', () => {}); //Transfer(_from, _to, _tokenId );
folder.on('', () => {}); //Approval(_owner, _approved, _tokenId );
folder.on('', () => {}); //ApprovalForAll(_owner, _operator, _approved );
folder.on('', () => {}); //IsPaused(bool isPaused);
folder.on('', () => {}); //TokenProofUpdate(_tokenId, _proof);
folder.on('', () => {}); //AssignAbility(_target, _ability);
folder.on('', () => {}); //RevokeAbility(_target, _ability);
folder.off('', () => {});
folder.transferFrom({ assetId, makerId, takerId }); // najprej te more approvat, vedno klices safeTransferFrom
folder.enable(); // setPause()
folder.disable() // .perform().resolve();
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
folder.assignAbilities(accountId, [1,2,3]);
folder.revokeAbilities(accountId, [1,2,3]);
folder.revokeAsset(); // revokable
folder.balanceOf(accountId);
folder.ownerOf(assetId);
folder.createAsset(assetId, proof, accountId);
folder.subscribe();
folder.unsubscribe();

const folder = new Folder({ ...context });

// const exchange = new Exchange({ context });
// exchange.claim();
// exchange.mint({
//   ...
// });

// const minter = new Minter({ context });
// minter.claim();
// minter.mint({
//   ...
// });
```

```ts
import { Connector } from '@0xcert/web3-connector';
import { Asset } from '@0xcert/assets';

// connector
const connector = new Connector({
  retryGasMultiplier: 1.2,
  makerId: '0x...',
});
// folder
const folder = connector.getFolder('0x...');
// folder:query
const { data } = folder.getSupply();
// folder:mutation
const { hash } = folder.burn();
// minter
const minter = connector.getMinter();
// minter
const exchange = connector.getExchange();
```

```ts
import { Connector } from '@0xcert/web3-connector';
import { Asset } from '@0xcert/assets';

// connector
const connector = new Connector({
  retryGasMultiplier: 1.2,
  makerId: '0x...',
});
// folder
const folder = connector.getFolder('0x...');
// order
const order = connector.createOrder({
  takerId: '',
  asset: { ... },
  transfers: [ ... ],
  seed: '',
  expiration: '',
  signature: '',
});
await order.sign();
await order.perform();
order.serialize();

// swap
const exchange = connector.createSwap();
```




```ts
const connector = new Connector({
  web3Provider: '...',
  retryGasMultiplier: 1.2,
  makerId: '',
});
connector.version;
await connector.getFolder(folderId);
await connector.getVault(vaultId);
await connector.getMinter({ minterId });
await connector.getExchange({ exchangeId });
await connector.deployFolder({ name, symbol, uriRoot, conventionId }); // erc721
await connector.deployVault({ name, symbol }); // erc20
await connector.createMinterDeal({ recipe?, claim?, signature? });
await connector.createExchangeDeal({ recipe?, claim?, signature? });

const folder = await connector.deployFolder({ name, symbol, uriRoot, conventionId });
const folder = await connector.getFolder(folderId);
await folder.getAbilities(accountId);
await folder.getCapabilities();
await folder.getInfo();
await folder.getSupply();
await folder.getTransferState();
await folder.assignAbilities(accountId, abilities);
await folder.revokeAbilities(accountId, abilities);
await folder.setTransferState(state);

const vault = await connector.deployVault({ name, symbol });
const vault = await connector.getVault(folderId);
await vault.getAbilities(accountId);
await vault.getCapabilities();
await vault.getInfo();
await vault.getSupply();
await vault.getTransferState();
await vault.assignAbilities(accountId, abilities);
await vault.revokeAbilities(accountId, abilities);
await vault.setTransferState(state);

const deal = await connector.createMinterDeal({ recipe?, claim?, signature? });
const deal = await connector.createExchangeDeal({ recipe?, claim?, signature? });
deal.populate({ claim?, signature?, recipe? });
deal.serialize();
await deal.build({ makerId?, takerId, transfers, seed?, expiration? });
await deal.sign();

const minter = await connector.getMinter({ minterId });
const exchange = await connector.getExchange({ exchangeId });
exchange.on('swap', () => {});
exchange.off('swap', () => {});
exchange.subscribe();
exchange.unsubscribe();
await exchange.perform(deal);
await exchange.cancel(deal);
```

```ts
0xcert-connector                    // connector typescript types
0xcert-crypto                       // isomorphic implementation of crypto functions
0xcert-merkle                       // merkle tree proof implementation
0xcert-web3-connector               // [main] web3 connector
0xcert-web3-sandbox                 // web3 sandbox blockchain for running tests
0xcert-web3-error-parser                  // web3 errors parser 
0xcert-web3-exchange                // atomic swap order API
0xcert-web3-folder                  // assets smart contract API
0xcert-web3-intents                 // web3 query and mutation requests
0xcert-web3-minter                  // atomic mint order API
0xcert-web3-exchange-contracts      // exchange blockchain contracts for web3
0xcert-web3-minter-contracts        // minter blockchain contracts for web3
0xcert-web3-erc20-contracts         // monolithic erc20 blockchain contracts for web3
0xcert-web3-erc721-contracts        // monolithicerc721 blockchain contracts for web3
0xcert-web3-proxy-contracts         // proxy blockchain contracts for web3
0xcert-web3-utils-contracts         // helper blockchain contracts for web3
0xcert-web3-xcert-contracts         // xcert blockchain contracts for web3
0xcert-web3-zxc-contracts           // zxc blockchain contracts for web3
```





```ts
import { Connector } from '@0xcert/web3-connector';

const conn = new Connector({
  web3: '...',
  makerId: '',
});
conn.web3;
await conn.attach();
await conn.detack();
await conn.sign(data, method);
await conn.query(async () => {});
await conn.mutation(async () => {});
```
```ts
import { Folder } from '@0xcert/web3-folder';

const folder = await Folder.deploy({ name, symbol, uriRoot, conventionId }, conn);
const folder = new Folder(conn);
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

const vault = await Vault.deploy({ name, symbol }, conn);
const vault = await new Vault(folderId, conn);
await vault.getAbilities(accountId);
await vault.getCapabilities();
await vault.getInfo();
await vault.getSupply();
await vault.getTransferState();
await vault.assignAbilities(accountId, abilities);
await vault.revokeAbilities(accountId, abilities);
await vault.setTransferState(state);
```
```ts
import { Minter, MinterOrder } from '@0xcert/web3-minter';
import { Exchange, ExchangeOrder } from '@0xcert/web3-exchange';

const order = new MinterOrder({ recipe?, claim?, signature? }, conn);
const order = new ExchangeOrder({ recipe?, claim?, signature? }, conn);
order.populate({ claim?, signature?, recipe? });
order.serialize();
await order.build({ makerId?, takerId, transfers, seed?, expiration? });
await order.sign();

const minter = new Minter({ minterId }, conn);
const exchange = new Exchange({ exchangeId }, conn);
exchange.on('swap', () => {});
exchange.off('swap', () => {});
exchange.subscribe();
exchange.unsubscribe();
await exchange.perform(order);
await exchange.cancel(order);
```
```ts
0xcert/scaffold
0xcert/crypto
0xcert/merkle

0xcert/web3-context // main
0xcert/web3-exchange // main
0xcert/web3-minter // main
0xcert/web3-folder // main
0xcert/web3-vault // main
0xcert/web3-sandbox
0xcert/web3-error-parser
0xcert/web3-utils

0xcert/web3-exchange-contracts
0xcert/web3-minter-contracts
0xcert/web3-erc20-contracts
0xcert/web3-erc721-contracts
0xcert/web3-proxy-contracts
0xcert/web3-utils-contracts
0xcert/web3-xcert-contracts
0xcert/web3-zxc-contracts
```
