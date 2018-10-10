<img src="assets/cover.png" />

![Build Status](https://travis-ci.org/0xcert/scanner.svg?branch=master)&nbsp;[![npm version](https://badge.fury.io/js/%400xcert%2Fscanner.svg)](https://badge.fury.io/js/%400xcert%2Fscanner)&nbsp;[![Dependency Status](https://gemnasium.com/0xcert/scanner.svg)](https://gemnasium.com/0xcert/scanner)

> 0xcert Ethereum blockchain scanner.

This is an open source package for NodeJS written in [TypeScript](https://www.typescriptlang.org). It allows for scanning of the Ethereum blockchain for ERC721 based and 0xcert protocol related contracts and transactions.

This package is actively maintained, well tested and already used in production environments. The source code is available on [GitHub](https://github.com/0xcert/scanner) where you can also find our [issue tracker](https://github.com/0xcert/scanner/issues).

## Installation

Run the command below to install the package.

```
npm install --save @0xcert/scanner
```

The package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Getting started

Basic use of scanner package.

```ts
import * as Web3 from 'web3';
import { Scanner, ScannerOptions } from '@0xcert/scanner';

const endpoint = 'http://localhost:8546';
const provider = new Web3.providers.HttpProvider(endpoint);
const web3 = new Web3(provider);

const options = new ScannerOptions({
  web3: web3,
  addresses: [],
  tests: [],
});

const scanner = new Scanner(options);
```

## Real time scanning

Processes all incoming ethereum transactions in real time. Scanner checks for 2 types of transactions:
- the contract creation transaction and
- normal token transaction.

Contract creation transactions are used to check for new ERC721 contracts that emerge on the network, while normal transactions are used to determine transfer of tokens and value trough those contract. Your must provide a WebSocket Web3 endpoint in configuration.

```ts
import * as Web3 from 'web3';
import { Scanner } from '@0xcert/scanner';

const endpoint = 'ws://localhost:8545';
const provider = new Web3.providers.WebsocketProvider(endpoint);
const web3 = new Web3(provider);

const options = new ScannerOptions({
  web3: web3,
  addresses: [],
  tests: [],
});

const scanner = new Scanner(options);

await scanner.connect({
  onTransaction: (err: TxError, cbk: Tx) => {},
  onContract: (err: CtxError, cbk: Ctx) => {},
});
```

## Process block

Load and parse data of a particular block.

```ts
import * as Web3 from 'web3';
import { Scanner, ScannerOptions } from '@0xcert/scanner'

const endpoint = 'http://localhost:8546';
const provider = new Web3.providers.HttpProvider(endpoint);
const web3 = new Web3(provider);

const options = new ScannerOptions({
  web3: web3,
  addresses: [],
  tests: [],
});

const scanner = new Scanner(options);
const block = 1231;
const txs = await scanner.scanBlock(block);
```

## Process transaction

Load and parse particular transaction.

```ts
import * as Web3 from 'web3';
import { Scanner, ScannerOptions } from '@0xcert/scanner'

const endpoint = 'http://localhost:8546';
const provider = new Web3.providers.HttpProvider(endpoint);
const web3 = new Web3(provider);

const options = new ScannerOptions({
  web3: web3,
  addresses: [],
  tests: [],
});

const scanner = new Scanner(options);
const hash = '0x1231...';
const tx = await scanner.scanTx(hash);
```

## API

### ScannerOptions Class

**ScannerOptions**
> Provides options to configure Scanner 
> Defines a new model property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| web3 | Web3 | Yes | - | Web3 connection - HTTP of WS - WS connection is needed for using Scanner events
| addresses | String[] | No | [] | Lock Scanner to parse only transactions from specific addresses - contract or wallet. Empty processes all addresses
| tests | String[] | No | [] | Add custom tests for testing transactions or use only subset of default tests - empty runs all default contract tests

**Defining Web3 HTTP connection:** 
```ts
import * as Web3 from 'web3';
import {ScannerOptions} from '@0xcert/scanner';

const endpoint = 'http://localhost:8546';
const provider = new Web3.providers.HttpProvider(endpoint);

const web3 = new Web3(provider);
const options = new ScannerOptions({ web3: web3 });
```

**Defining Web3 WS connection:** 
> WS provider must be used on order to use the event based transaction and contract discovery
```ts
import * as Web3 from 'web3';
import {ScannerOptions} from '@0xcert/scanner';

const endpoint = 'ws://localhost:8545';
const provider = new Web3.providers.WebsocketProvider(endpoint);

const web3 = new Web3(provider);
const options = new ScannerOptions({ web3: web3});
```

**Defining addresses property:** 
> If you want to parse transaction for specific accounts or from specific contracts, you can limit the scanner to only check for these addresses. Scanner looks in TO and FROM fields in transactions and compares to provided addresses.
```ts
import * as Web3 from 'web3';
import {ScannerOptions} from '@0xcert/scanner';

const options = new ScannerOptions({ 
  addresses: [
    '0xc1912fee45d61c87cc5ea59dae31190fffff2323',
    '0XC1912FEE45D61C87CC5EA59DAE31190FFFFF232D',
  ],
});
```

**Defining tests property:** 

> Scanner tests contracts where transactions originate from with various tests to determine if contracts exposes all standard ERC721 interfaces. At 0xcert, we also test for additional interfaces in order to the detect contracts and transactions that are extended from 0xcert protocol. You can add custom tests that the scanner will perform on transactions. Successful tests are appended to the contract returned from the Scanner as IDs.

```ts
import * as Web3 from 'web3';
import {ScannerOptions} from '@0xcert/scanner';

const options = new ScannerOptions({ 
  tests: [
    // Basic ERC721 tests
    '0x80ac58cd', // Test for ERC721
    '0x5b5e139f', // Test for ERC721 Metadata
    ... 
    // Example tests for 0xcert based contracts
    '0x6be14f75', // Test for 0xcert
    '0x42966c68', // Test for 0xcert Burnable
    '0xc1dcb551', // Test for 0xcert Connectorable
    '0x59118221', // Test for 0xcert Mutable
    '0xbedb86fb', // Test for 0xcert Pausable
    '0x20c5429b', // Test for 0xcert Revokable
    ... 
    // Custom tests can be appended to the tests array
    '0x00000000', // Test for your custom interface
  ],
});
```

### Scanner Class

**Scanner(ScannerOptions)**

> Main class which allows for scanning the Ethereum blockchain.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options | ScannerOptions | Yes | {} | Scanner options object

**NOTICE:** The scanner class extends a [RawModel class](https://github.com/xpepermint/rawmodeljs) and thus exposes all related helper methods.

**Scanner.prototype.connect(block)**: TxCallback(Tx), CtxCallback(Ctx)

> Connects to the websocket Web3 endpoint and triggers callback calls when new transactions or contracts are detected

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| onTransaction | Function | Yes | - | Callback function in new transaction
| onContract | Function | Yes | - | Callback function in new contract.

**Scanner.prototype.scanBlock(block: number)**: Promise(JSON)

> Populates the scanner with block data and then returns serialized transaction and contract data.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| block | Integer | Yes | - | Block number.

**Scanner.prototype.scanTx(hash: string)**: Promise(JSON)

> Populates the scanner with transaction data then returns parsed serialized transaction data.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| hash | String | Yes | - | Transaction hash.

## License (MIT)

Copyright (c) 2018 0xcert <admin@0xcert.org>.
