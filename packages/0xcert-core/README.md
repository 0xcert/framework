# Interface proposal

## Protocol

First initialize the protocol instance.

```ts
import { Chain } from '@0xcert/web3-chain';
import { Store } from '@0xcert/ipfs-store';
import { Protocol, AbilityId, Action, EventId } from '@0xcert/core';

const protocol = new Protocol({
  chain: new Chain({ ... }),
  store: new Store({ ... }),
});
```

Listen to protocol events.

```ts
protocol.on({
  event: EventId.EVENT_NAME,
  action: async () => {},
});
protocol.off({
  event: EventId.EVENT_NAME,
});
```

## Folder 

Read folder metadata.

```ts
const { name, symbol } = await protocol.perform({
  action: Action.FOLDER_READ_METADATA,
  folderId: '0x...',
});
```

Read folder total supply.

```ts
const { name, symbol, uriRoot } = await protocol.perform({
  action: Action.FOLDER_READ_SUPPLY,
  folderId: '0x...',
});
```

Read folder features.

```ts
const { isBurnable, isMutatable, isPausable, isRevokable } = await protocol.perform({
  action: Action.FOLDER_READ_CAPABILITIES,
  folderId: '0x...',
});
```








Check if an account is authorized to perform a certain action.

```ts
const { isAuthorized } = await protocol.perform({
  action: Action.FOLDER_CHECK_ACCOUNT_ABILITY,
  folderId: '0x...',
  acountId: '0x...',
  ability: AbilityId.MINTER_MINT,
});
```

Check if an account can operate on behalf of.

```ts
const { isApproved } = await protocol.perform({
  action: Action.CHECK_FOLDER_TOKEN_APPROVAL,
  folderId: '0x...',
  acountId: '0x...',
  tokenId: '100',
});
```

Check if the asset transfer is enabled.

```ts
const { isPaused } = await protocol.perform({
  action: Action.CHECK_FOLDER_TOKEN_TRANSFER_STATE,
  folderId: '0x...',
});
```

Start or stop asset transfers.

```ts
const { isPaused } = await protocol.perform({
  action: Action.UPDATE_FOLDER_TRANSFER_STATE,
  folderId: '0x...',
  data: {
    isEnabled: true,
  },
});
```

Update folder metadata.

```ts
const { name, symbol, uriRoot } = await protocol.perform({
  action: Action.UPDATE_FOLDER_METADATA,
  folderId: '0x...',
  data: {
    name: 'Foo',
    symbol: 'Bar',
    uriRoot: 'http://foobar.com',
  },
});
```

Deploy new folder.

```ts
const { folderId, txId } = await protocol.perform({
  action: Action.DEPLOY_NEW_FOLDER,
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
  action: Action.GENERATE_MINT_CLAIM,
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
  action: Action.EXECUTE_MINT_CLAIM,
  data: {
    mintClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

Cancel mint claim.

```ts
const { txId } = await protocol.perform({
  action: Action.CANCEL_MINT_CLAIM,
  data: {
    mintClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

## DEX

Generate new exchange order claim.

```ts
const { exchangeClaim } = await protocol.perform({
  action: Action.GENERATE_EXCHANGE_CLAIM,
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
  action: Action.EXECUTE_EXCHANGE_CLAIM,
  data: {
    exchangeClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

Cancel exchange claim.

```ts
const { txId } = await protocol.perform({
  action: Action.CANCEL_EXCHANGE_CLAIM,
  data: {
    exchangeClaim: 'afj1j2skdjksnnvmblk...',
  },
});
```

## Asset

Read asset on the network.

```ts
const { publicData, publicProof } = await protocol.perform({
  action: Action.READ_ASSET_DATA,
  folderId: '0x...',
  assetId: '0x...',
});
```

Create new asset data with optional exposed field (user can verify the exposed content from `proofData` and `proofHash`).

```ts
const { privateData, publicData, proofData, proofHash } = await protocol.perform({
  action: Action.GENERATE_ASSET_DATA,
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
  action: Action.VERIFY_ASSET_DATA,
  proofData,
  proofHash,
});
```
