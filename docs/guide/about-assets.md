# About assets

When discussing assets, we think of different things of value. The simplest examples are the items you keep in your physical wallet, like cash in banknotes and coins, ID cards, a driver license, credit cards, etc. All of those are assets.

## Assets are non-fungible

By definition, unique assets are one-of-a-kind, unrepeatable and undividable objects, representing valuable information such as identity, licenses, certificates, etc.

Within the realm of the blockchain and other distributed platforms, these assets are represented by non-fungible tokens (NFTs). The Ethereum community has reached a consensus and adopted the [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) standard to define and serve as an interface for non-fungible tokens on the Ethereum blockchain, and recently also on other platforms. The Wanchain community has also adopted the ERC-721 standard for non-fungible tokens on the Wanchain blockchain.

## Explaining the concept

Let's start with an example. Your driver license is an asset. You own it. Generally speaking, driver licenses as a category of documents are on an asset ledger since they are all issued by an authority and all contain the same set of data. The government issues your driver license which makes the government the issuer of the license.

A distributed ledger can be thought of as a folder, containing different assets of a specific issuer and related owners. Only the users authorized by the ledger owner are allowed to manage the ledger. Depending on its configuration, authorized persons can handle the ledger and thus create and manage its assets.

An asset is defined in the form of a specifically designed [JSON](https://en.wikipedia.org/wiki/JSON) object, which conforms to the [RFC-7159](https://tools.ietf.org/html/rfc7159) and follows the mapping format defined by the [JSON Schema](http://json-schema.org/) specification. This schema shows data conventions and the structure of asset database.

Therefore, within the 0xcert Framework, every asset is structured based on a particular schema. Some part of the data can be public, others can stay private. Asset data objects are stored in a centralized or decentralized database. The issuer is the one who created the asset; and the data can be known by both the issuer and the current owner of the asset.

Every asset is stored in the platform as an ERC-721 non-fungible token. The 0xcert Framework has additional functions to manage the ledger and its assets, which are not included in the ERC-721 Standard.

Every asset is identified by a unique ID that describes an asset within a ledger. Every asset also has its own cryptographical proof. This proof is called an `imprint` and is created from the original asset data object. The imprint, along with its asset ID, are stored within a non-fungible token. The issuer and the owner can reveal certain data from the block to third parties. Thus, a non-fungible token can serve as a publicly available proof, which allows third-party data verification. This concept is further explained in the [Certification](/guide/certification.html) section.

Apart from the imprint, every asset also includes a URI, pointing to a publicly available [JSON](https://en.wikipedia.org/wiki/JSON) metadata file with additional public information about the asset. This information is intended for public listing on different online services.

---

Now that we learned what assets are, let's see how we can [certify and validate](/guide/certification.html) them.
