# Asset Management

When discussing assets, we think of different things of value. The simplest examples are the items you keep in your physical wallet, like cash in banknotes and coins, ID cards, a driver license, credit cards, etc. While this items can all be classified as assets, when talking about an asset in the context of 0xcert framework **an asset must be unique**.

So if take the items described above some of them no longer fall into the catagory of an asset. Namely banknotes and coins. Why is that? That is because if I exchange a 10$ bill with Saras 10$ bill we will both retain the same value. But if I exchange my ID card with Saras that ceases to be true.

Another thing is to consider is that what we are discussing are pyshical items. While 0xcert framework operates with digital unique (non fungible) assets. Luckily most physical items can be simply represented in a digital shape using IDs and meta descriptions. 

Unique digital assets are represented on the Ethereum blockchain in the form of [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) standard. This standard defines how the basic smart contract looks like and how each non fungible token is defined. To incorporate full range functionalities the 0xcert framework offers the base ERC-721 code had to be enhanced with additional functionalities that became what we now call an Xcert. Xcert is fully ERC-721 compatible and adds [certification]() and other usefull functionalitites.

Xcert is a smart contract that contains assets of a specific kind. Meaning when creation an Xcert you define what properties assets created whitin it will have. For an example lets say you are a KYC provider. You define what properties a KYC asset needs to have and create an Xcert with this definition. Now each KYC asset you issue on this smart contract needs to follow its rules. For more about this check the [certification]() section.

AssetLedger directly connects to a Xcert smart contract on the blockchain. Meaning things with do with an Asset ledger are directly reflected on the blockchain. An asset you create on an `AssetLedger` directly translate to an asset created on the underlying `Xcert` smart contract.

TLDR: An asset ledger is a containter defining how assets in it look like. While an asset is a unique digital representation of an item that is created on an asset ledger and follows its definition.

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-using-providers?module=%2FREADME.md) to check the live example for this section.
:::

## Installation

We recommend you employ the asset ledger module as an NPM package in your application.

```ell
$ npm i --save @0xcert/ethereum-asset-ledger
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that you can directly include in your website. Please refer to the [API](/api/core.html) section to learn more about asset ledger.

## Creating a new AssetLedger

