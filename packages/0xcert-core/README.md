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
protocol.createQuery(FOLDER_CHECK_ABILITY, { ... });
protocol.createQuery(FOLDER_CHECK_APPROVAL, { ... });
protocol.createQuery(FOLDER_CHECK_TRANSFER_STATE, { ... });
protocol.createQuery(FOLDER_READ_CAPABILITIES, { ... });
protocol.createQuery(FOLDER_READ_METADATA, { ... });
protocol.createQuery(FOLDER_READ_SUPPLY, { ... });

protocol.createMutation(FOLDER_SET_TRANSFER_STATE, { ... });
protocol.createMutation(FOLDER_SET_URI_BASE, { ... });
protocol.createMutation(FOLDER_CREATE_ASSET, { ... }); //

protocol.createMutation(MINTER_PERFORM_CREATE_ASSET_CLAIM, { ... });
protocol.createMutation(MINTER_CANCEL_CREATE_ASSET_CLAIM, { ... });

protocol.createMutation(EXCHANGE_PERFORM_SWAP_CLAIM, { ... });
protocol.createMutation(EXCHANGE_CANCEL_SWAP_CLAIM, { ... });

protocol.generateClaim(MINTER_CREATE_ASSET, { ... });
protocol.generateClaim(EXCHANGE_SWAP, { ... });

protocol.createAsset(USER_IDENTITY, { ... });
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

Create new asset data with optional exposed field (user can verify the exposed content from `proofData` and `proofHash`).

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
