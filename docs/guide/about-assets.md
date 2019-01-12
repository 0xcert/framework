# About assets

When discussing assets, we think of different things of value. The simplest explanation relates to the items you keep in your physical wallet. It usually holds some cash in banknotes and coins, but also a bunch of other things. These other things like your ID, driving license, social security card, etc. all represent unique assets.

## Assets are non-fungible

By definition, unique assets are one-of-a-kind, unrepeatable and undividable objects that represent valuable information such as identity, licenses, certificates, etc.

Within the realm of the blockchain and other distributed platforms, these assets are represented by non-fungible tokens (NFTs). The Ethereum community has reached a consensus and adopted the [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) standard to define and serve as an interface for non-fungible tokens on the Ethereum blockchain, and recently also on other platforms.

## Explaining the concept

Explaining the concept is a challenge on its own. Let's try with an example. Your driving license is an asset. You own it, and that makes you the owner of your driving license. Generally speaking, driving licenses as a category of documents are an asset ledger since they all contain the same set of data. The government issues your driving license which makes the government the issuer of the license.

A ledger, therefore, represents a folder containing the assets of a specific issuer and related owners. Only the users authorized by the ledger owner are allowed to manage the ledger. Depending on its configuration, authorized persons can handle the ledger and thus create and manage its assets.

An asset is defined in the form of a specifically designed [JSON](https://en.wikipedia.org/wiki/JSON) object, which conforms to the [RFC-7159](https://tools.ietf.org/html/rfc7159) and follows the mapping format defined by the [JSON Schema](http://json-schema.org/) specification. This schema represents data conventions and the structure of asset data.

Therefore, within the 0xcert Framework, every asset is structured based on a particular schema. Some data of such block can be public, other data can be private. Asset data objects are stored in a centralized or decentralized database. The issuer is the one that creates an asset, and the original data is always known to both the issuer and the owner of the asset.

Every asset is stored on the platform as an ERC-721 non-fungible token (NFT). The 0xcert Framework, however, includes an additional set of functions for managing the ledger and its assets which are not included in the ERC-721 standard.

Every asset is identified by an ID that uniquely describes an asset within a ledger. Every asset also has its own cryptographical proof. This proof is called an `imprint` and is created from the original asset data object. The imprint is stored together with an asset ID within a non-fungible token. The issuer and the owner can reveal certain data from the block to third parties. Thus, a non-fungible token serves as a publicly available proof that allows for third-party verification of data validity. This concept is further described in the [Certification](https://docs.0xcert.org/guide/certification.html) section.

Apart from the imprint, every asset includes a URI which points to a publicly available [JSON](https://en.wikipedia.org/wiki/JSON) metadata file with additional public information about the asset. This information is meant for public listing on different online services.

---

Now that we learned what assets are let's see how we can [certify and validate](https://docs.0xcert.org/guide/certification.html) them.
