# 0xcert suite

## TODO

### Docs

- add provider errors table
- add asset ledger
- add value ledger
- add order gateway

### Core

- [L,K,T] 0xcert/ethereum-utils complete refactoring - remove web3
- [K] use BigNumber for all ethereum packages (when 0xcert/ethereum-utils is refactored)
- [K] HttpProvider and WsProvider refactor - remove web3
- [T] GenericProvider, OrderGateway support safeTransfer by adding a list of trusted addresses
- [T] automatically handle `gas: 6000000,` on mutations
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
