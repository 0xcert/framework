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
import { Scanner } from '@0xcert/scanner';

const options: ScannerOptions = {
  web3: new Web3('http://localhost:8545'),
  addresses: [],
  tests: [],
};

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

const options: ScannerOptions = {
  web3: new Web3('ws://localhost:8546'),
  addresses: [], // empty array processes all incoming transactions
  tests: [], // empty runs all default tests on origin contracts
};

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
import { Scanner } from '@0xcert/scanner'

const options: ScannerOptions = {
  web3: new Web3('http://localhost:8546'),
  addresses: [], // empty processes all transactions
  tests: [], // empty runs all default contract tests
};

const scanner = new Scanner(options);
const block = 1231;
const txs = await scanner.scanBlock(block);
```

## Process transaction

Load and parse particular transaction.

```ts
import * as Web3 from 'web3';
import { Scanner } from '@0xcert/scanner'

const options: ScannerOptions = {
  web3: new Web3('http://localhost:8546'),
  addresses: [], // empty processes all transactions
  tests: [], // empty runs all default contract tests
};

const scanner = new Scanner(options);
const hash = '0x1231...';
const tx = await scanner.scanTx(hash);
```

## API

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
