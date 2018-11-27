# Confirmed API

## Packages

```ts
import { EthereumConnector } from '@0xcert/ethereum-connector';

const connector = new EthereumConnector({
  provider: window.ethereum,
  password: '',
  timeout: '',
});
connector.isSupported();
await connector.enable();
await connector.isEnabled();
await connector.queryContract({}); // eth_call
await connector.mutateContract({}); // eth_call
await connector.getBlock(); // eth_getBlockByNumber
await connector.getGasPrice(); // eth_gasPrice
await connector.getGasEstimation(); // eth_estimateGas
```
```ts
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';

const ledger = new AssetLedger(connector, ledgerId);
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
import { ValueLedger } from '@0xcert/ethereum-value-ledger';

const ledger = await new ValueLedger(provider, ledgerId);
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
};
const asset = {
  $schema: 'http...',
  $evidence: 'http...',
  name: '',
  description: '',
  image: '',
};
```
```ts
import { OrderGateway } from '@0xcert/ethereum-order-gateway';

const gateway = new OrderGateway(context);
gateway.on(event, handler);
gateway.off(event, handler);
gateway.subscribe();
gateway.unsubscribe();
await gateway.claim(order); // signed claim (maker)
await gateway.cancel(order); // (maker)
await gateway.perform(order, signature); // (taker)
```
```ts
import { Cert } from '@0xcert/certification';

const cert = new Cert({ schema });
const proofs = await cert.notarize(data);
const proofs = await cert.disclose(exampleData, [ ...paths... ]);
const imprint = await cert.calculate(data, proofs);
const imprint = await cert.imprint(data);
```
```ts
import { MutationTracker } from '@0xcert/mutation-tracker';

const tracker = new MutationTracker(context);
tracker.on(event, handler);
tracker.off(event, handler);
tracker.add(transactionId, transactionId, ...);
tracker.check(transactionId);
tracker.remove(transactionId, transactionId, ...);
tracker.isRunning();
tracker.start();
tracker.stop();
tracker.clear();
```

## Framework

```ts
import { EthereumConnector } from '@0xcert/ethereum-connector';
import { AssetLedger } from '@0xcert/ethereum-asset-ledger';
import { ValueLedger } from '@0xcert/ethereum-value-ledger';
import { OrderGateway } from '@0xcert/ethereum-order-gateway';
import { Cert } from '@0xcert/certification';
import { MutationTracker } from '@0xcert/ethereum-tracker';

const provider = new EthereumConnector({
  provider: window.ethereum,
  password: '',
  timeout: '',
});
provider.enable();
provider.isSupported();
provider.isEnabled();

const mutation = await AssetLedger.deploy();
const assetLedger = new AssetLedger({ provider, id });
await assetLedger.getSupply();

const mutation = await ValueLedger.deploy();
const valueLedger = new ValueLedger({ provider, id });
await valueLedger.getSupply();

const orderGateway = new OrderGateway({ provider });
await orderGateway.claim();

const tracker = new MutationTracker({ provider });
tracker.on(event, handler);
tracker.start();

const cert = new Cert({ schema });
await cert.notarize(data);
```

# Structs


Asset JSON object:

```json
{
  "$schema": "",
  "$evidence": "",
  "name": "",
  "description": "",
  "image": ""
}
```

Asset evidence:

```js
const patsh = [
  ['books', 0, 'release', 'date'],
]
const json = {
  name: 'John',
  books: [
    {
      title: 'Start',
      release: {
        date: '',
      },
    },
  ],
};
const recipe = [
  {
    path: [],
    evidence: {
      proofs: [
        { index: 0, hash: '0x', key: 'name' },
        { index: 1, hash: '0x', key: 'book' },
        { index: 2, hash: '0x', key: 'books' },
      ],
      nodes: [
        { index: 0, hash: '0x' },
        { index: 1, hash: '0x' },
      ],
    },
  },
  {
    path: ['book'],
    evidence: {
      proofs: [
        { index: 0, hash: '0x', key: 'title' },
      ],
      nodes: [
        { index: 0, hash: '0x' },
      ],
    },
  },
  {
    path: ['books'],
    evidence: {
      proofs: [
        { index: 0, hash: '0x', key: 0 },
      ],
      nodes: [
        { index: 0, hash: '0x' },
      ],
    },
  },
  {
    path: ['books', 0],
    evidence: {
      proofs: [
        { index: 0, hash: '0x', key: 'title' },
      ],
      nodes: [
        { index: 0, hash: '0x' },
      ],
    },
  },
];
```

## NOTES

- add listner for metamask address changed
