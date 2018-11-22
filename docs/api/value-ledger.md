# Value Ledger

When working on your NFT you'll probably need to interact with value (fungible) tokens as well, not just NFTs. For example, maybe you'll need to know how many ZXC tokens are in supply.

The 0xcert framework provides support for accessing the value ledger of blockchains. One example implementation is the Ethereum ERC20 tokens.

## Value Ledger Base

`ValueLedgerBase` is an `interface` that encapsulates the functionality that different blockchain implementations build upon.

Using this base gives you access to the following information about a token:
* token name, e.g. `0xcert Protocol Token`,
* token symbol, e.g. `ZXC`,
* decimals, e.g. `18`,
* supply, e.g. `500000000000000000000000000`.

To get this information, use the following functions from the `ValueLedgerBase`:
* `getSupply(): Promise<Query<number>>`: gets the total supply of a token.
* `getInfo(): Promise<Query<ValueLedgerGetInfoResult>>`: gets the remaining information in an object with parameters: `name`, `symbol` and `decimals`.

# Ethereum Value Ledger

The Ethereum Value Ledger is a specific implementation of the Value Ledger Base. It works behind the scenes by tapping into the ERC20 smart contract information. It does this by utilizing the ERC20 ABI and the Ethereum's web3.js library to call the smart contract functions on the Ethereum blockchain.
