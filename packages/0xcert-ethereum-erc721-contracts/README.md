<img src="../../assets/cover-sub.png" />

> Smart contract implementation of the ERC-721 standard on the Ethereum blockchain.

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).

## Package explanation

This package is based on our [**official ERC-721 implementation**](https://github.com/0xcert/ethereum-erc721), but while the official implementation focuses on nice architecture for better readability and understanding for programmers, this package focuses mainly on the best [gas efficiency](https://github.com/0xcert/ethereum-erc721/issues/188). For this reason, we also have some opinionated implementations of, for example, how we handle token URIs.

# Build

By default, the contracts in this package are built for Constantinople EVM. If you would like to use these smart contracts for `Wanchain` or other blockchains using EVM for a different version, you will need to rebuild them for the desired version.
