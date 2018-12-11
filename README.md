# 0xcert suite

## TODO

### Tests

Blockers for 1.0.0-beta.1:

- add a test for erc-20 using Truffle
- make it work in travis (costs $70), include badge on repo README.md
- add a test for erc-20 using Spectron
- make it work in travis
- add all other smart contract tests (ONE TEST PER CONTRACT)
- remove travis test
- add unit tests for other parts of framework (ONE TEST ONLY PER PACKAGE)
- make everything work in travis using one job per package
- find a test coverage tool that works for each package, add it to travis builds
  - make test coverage required
  - travis will be failing at the point

Blockers for 1.0.0-rc.1:

- update tests to resolve code coverage errors
- update tests to resolve other errors


### Docs

- add provider errors table
- add asset ledger
- add value ledger
- add order gateway

### Core

- [L,K,T] 0xcert/ethereum-utils complete refactoring - remove web3
- [K] WsProvider for https://github.com/ethereum/go-ethereum/wiki/RPC-PUB-SUB (window.Websocket or require('ws')).
- [K] AssetLedger, ValueLedger and OrderGateway subscribe to events (handle connetion lost)
- [K] use BigNumber for all ethereum packages (when 0xcert/ethereum-utils is refactored)
- [T] GenericProvider, OrderGateway support safeTransfer by adding a list of trusted addresses
- [T] automatically handle `gas: 6000000,` on mutations
- [T] add transfer to ValueLedger
- [T] upgrade to solidity 5
- [T] Trezor & EIP712 signature

## Development

Repository management: https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d
Codecov integration: https://gist.github.com/xpepermint/34c1815c2c0eae7aebed58941b16094e
Rush commands: https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d
Error code list: https://docs.google.com/spreadsheets/d/1TKiFKO9oORTIrMyjC11oqcaWWpTUVli5o9tOTh5Toio/edit?usp=sharing

## CDN hosting

```
https://cdn.jsdelivr.net/gh/0xcert/ethereum-erc721/dist/<file-name>.min.js
```

## Contributing

See [CONTRIBUTING.md](https://github.com/0xcert/suite/blob/master/CONTRIBUTING.md) for how to help out.

## Licence

See [LICENSE](https://github.com/0xcert/suite/blob/master/LICENCE) for details.

## CDN
Once this repo is public we'll be able to use the compiled libraries through a CDN like this:
* For `0xcert-main`: `https://cdn.jsdelivr.net/gh/0xcert/framework@[version]/dist/0xcert-main.js`,
* For `0xcert-web3`: `https://cdn.jsdelivr.net/gh/0xcert/framework@[version]/dist/0xcert-web3.js`.
