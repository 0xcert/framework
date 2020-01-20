# Certification

Various industries follow different standards. A standard reflects a need for defining a certain best practice and for establishing rules in a particular processor for a specific product. Today, companies and institutions mostly define their own rules of communication, operation, processes, and the format of stored and managed data. To establish more effective communication among them, the concept of system interoperability becomes increasingly valuable. As this idea develops over time, we will see companies and organizations choose interoperable systems more often.

## Interoperability standards

The [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) has become an important standard for describing non-fungible assets, not just within the Ethereum community but much broader. It has given us rules and directions for describing and managing unique assets. Although it represents an interoperability standard, there's a general misconception about its overall purpose and about which part of the interoperability does it cover. The ERC-721 specification states that the following standard allows for the implementation of a standard API for non-fungible tokens (NFTs) within smart contracts. It also states that it describes a basic functionality to track and transfer assets based on their IDs. So this standard covers the asset ownership aspect.

But wait! The ERC-721 standard identifies unique assets based on IDs? What about data that these IDs represent? How can we make sure that the data under a certain ID actually represents an asset we claim it represents? How can we prove the authenticity of an asset, and how can a third party verify our claims without an intermediary? When we start asking these questions, it becomes clear that the ERC-721 lacks these functionalities and that we need something more opinionated.

The 0xcert Protocol was designed to add context to these IDs. Thus, it supports the cases where non-fungible tokens must also prove metadata authenticity. The 0xcert Protocol extends the ERC-721 features and provides an opinionated, contextified, and interoperable solution that comes in the form of a unique certification process and is based on conventions. To keep concepts truly interoperable, we introduced a new [ERC-2477](https://github.com/ethereum/EIPs/pull/2477) standard which covers the core mechanism of the 0xcert Protocol.

The certification is one of the unique and important parts of the 0xcert Protocol. It consists of protocol conventions that define asset certification and verification steps, unique 0xcert hashing algorithms creating verifiable asset metadata proofs and other artifacts, and the Xcert smart contract API describing the implementation part of the certification logic on immutable storage.

## Certifying assets

Within the 0xcert ecosystem, an asset can represent various certificates, ranging from ISO certificates to car insurance contracts, academic credentials, agreements, and more. The certification process is responsible for generating digital proofs of asset metadata, which can be used by third-party users to verify asset information without intermediaries.

To create such proof for an arbitrary asset, we first need to prepare:
- asset `metadata` object holding asset information and
- asset `schema`, which describes asset context and metadata structure.

From these two objects, we then generate: 
- asset `imprint` string representing a cryptographic fingerprint of asset metadata generated through the 0xcert AIH algorithm,
- asset `evidence` JSON object, which describes disclosed asset metadata and
- asset `schema ID` string, which uniquely identifies asset schema object and is generated through the 0xcert ASH algorithm.

These are the main products of the certification process and together hold all the information needed to verify asset information mathematically. The following sections describe the certification process in more detail. The code snippets cover a step-by-step certification process of a simple crypto collectible. You can, however, apply these steps to any arbitrary use case.

[FULL EXAMPLE](https://gist.github.com/xpepermint/5e69e2654aaa78035db4e3c26cbbab0e)

::: card Live example
Click [here](https://codesandbox.io/s/github/0xcert/example-certification?module=%2FREADME.md) to check the live example for this section.
:::

### Installation

We recommend you employ the certification module as an NPM package in your application.

```sh
$ npm i --save @0xcert/cert
```

On our official open-source [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript files that can be directly implemented into your application or website. Please also refer to the [API Reference](/api/core.html) section to learn more about certification.

### Defining asset metadata

Asset metadata represents a digital object which holds asset information. It is described in the form of a common JSON object, which conforms to the [RFC-7159](https://en.wikipedia.org/wiki/JSON) specification. 

A simple metadata object for a crypto-collectible, which represents a magic sword item in the imaginary Troopers game, can be described with an `id`, `name`, `description`, `image` URL and `power` properties.

```json
{
  "id": 12,
  "name": "Magic Sword",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg",
  "power": 3000
}
```

You will agree that this JSON object is easily readable when someone reveals metadata context and structure. In reality, these items are most likely read by machines, thus we have to include context information within the metadata itself. The 0xcert Protocol suggests the `$schema` property be present in the metadata object, which points to a URI of a JSON object describing asset metadata context and structure. This property should always be present in the public metadata objects. We will talk more about the schema and how to define one in the next chapter. For now, let's just decide that our imaginary schema will be available at `https://troopersgame.com/` public address.

```json
{
  "$schema": "https://troopersgame.com/dog-schema.json",
  ...
}
```

By adding metadata schema information, we enable automatic machine-level interpretation of metadata objects. With the 0xcert Protocol, we can optionally attach cryptographic proofs for metadata properties, which allow for third-party mathematical verification of asset information. We attach these proofs through the `$evidence` property, which points to a URI of a JSON object with metadata proofs. The following sections describe this process in more detail. At this point, we just decide that our imaginary evidence, which will describe public metadata, will be available at `https://troopersgame.com/` public address.

```json
{
  "$evidence": "https://troopersgame.com/dog-evidence.json",
  ...
}
```

### Defining asset schema

Within the 0xcert Protocol, a digital asset employs a JSON Schema to describe asset context and data object structure. The asset schema allows for machine-level processing of asset information and thus makes each asset interoperable at the application layer.

Asset schema is a specifically designed JSON object, which conforms to [RFC-7159](https://en.wikipedia.org/wiki/JSON) and follows the mapping format defined by the [JSON Schema](http://json-schema.org) specification. The 0xcert Protocol supports only a subset of JSON Schema specification, which is described by the [Xcert JSON Schema](https://0xcert.org/conventions/xcert-schema.json). You should always refer to this JSON Schema subset when writing asset schemas for your projects.

We incentivize the community to agree on standard schema conventions. Schema conventions should be proposed and included in the official 0xcert repository on GitHub. The 0xcert Framework already provides some basic schema conventions for you to use. For the purpose of this guide, we will define a minimal custom asset schema that describes the context and properties of the metadata created earlier. 

```json
{
  "$schema": "https://0xcert.org/conventions/xcert-schema.json",
  "properties": {
    "$evidence": {
      "type": "string"
    },
    "$schema": {
      "type": "string"
    },
    "id": {
      "type": "string"
    },
    "image": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "power": {
      "type": "number"
    }
  },
  "title": "Cryptocollectible",
  "type": "object"
}
```

This JSON file should now be placed on a public address, which we defined in the metadata object in the previous section (`https://troopersgame.com/dog-schema.json`). When a machine reads the asset metadata, it will be able to understand the asset context and will know how to parse asset information.

Did you notice that a `description` property is not included in the schema? We did this intentionally just to show that the metadata object can include arbitrary properties. The schema, however, should include only the properties necessary to be included in the certification process. The properties defined in the schema are verifiable by a third party. Other arbitrary metadata properties are not included in the certification process and are simply ignored.

### Creating asset evidence, imprint and schema ID

The previous section explained how a context and metadata structure information are attached to an asset. In this chapter, we dive into the core mistery of certification and calculate the `imprint`, `evidence` and `schema ID` artifacts. These are the main products of the certification process defined by the 0xcert Protocol, which allows third-party users to verify asset metadata information without an intermediary.

An imprint represents a cryptographic fingerprint of a complete asset metadata object. It is calculated through the SXH2 algorithm and represents a mathematical proof of asset metadata existence, where at the same time, it ensures metadata confidentiality. The imprint is one of the decentralized artifacts of the certification process and should thus be stored on immutable storage like permissionless public blockchain (e.g., Ethereum) where trust is not an issue and third-party users can autonomously read data.

Unlike the imprint string, the evidence object represents a centralized artifact of the certification process and holds disclosed metadata information. Yes, we used the word "disclosed" because the 0xcert Protocol allows selective metadata verification. This means we can create a subset of metadata including only the selected properties we want to disclose to a third party. We will describe this concept in more detail in one of the following chapters. At this point, we only need to understand that the evidence object holds disclosed metadata property values together with all the required cryptographic proofs needed for someone to verify the asset information.

The final artifact of the certification process is the `schema ID` string. It is calculated through the `Schema Hashing algorithm` (SHA) and uniquely represents the schema object. This ID must be stored as a part of the immutable storage and identifies storage context (e.g., Ethereum smart contract).

Now let's write some code to see how these artifacts are generated. We already defined asset metadata in associated schema objects.

```ts
const metadata = { ... }; // the JSON metadata object we defined in previous sections
const schema = { ... }; // the JSON schema object we defined in previous sections
```

Next, we create an instance of a magical `Cert` class, provided by the `@0xcert/cert` NPM package, which provides a complete logic for certifying assets.

```ts
import { Cert } from '@0xcert/cert';

const cert = new Cert({
  schema, // we explain the metadata context and structure
});
```

We can now certify the asset in a few lines of code.

```ts
const imprint = await cert.imprint(metadata);
const evidence = await cert.notarize(metadata);
const schemaId = await cert.identify();
```

It is very important that we store `imprint` and `schemaId` strings in permanent, immutable storage. These two artifacts must be available to third-party users at all times and will permanently prove historical asset information in the present. We encourage you to use the Ethereum blockchain mainnet for storing these precious data. At this moment, Ethereum is probably the most decentralized and trusted network on the planet where people can trust the data is indeed genuine. In Ethereum, the schema ID should be stored as a part of the core asset ledger smart contract, and the imprint should be attached to the issued [ERC-721 token](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md). The 0xcert Protocol provides the implementation of such storage convention in the form of an upgraded ERC-721 smart contract API, called the [Xcert smart contract API](https://github.com/0xcert/framework/tree/e0d4e295f8fbf0b24f465f051cec8f7a6ef7f954/packages/0xcert-ethereum-xcert-contracts) which represents an asset ledger holding assets on the blockchain. When using the 0xcert Framework, you most likely won't be writing smart contracts but will instead be using higher-level 0xcert connectors, which hide the complexity of interactions within the immutable decentralized storage.

The `evidence` object, however, can be stored in some arbitrary place. In one of the previous sections, we wrote that the imaginary evidence object would be available at `https://troopersgame.com/` public address. Yes, we will do this when exposing metadata to the general public. If this is not the case and if we are exposing metadata to a specific user, we can just send the object through an arbitrary communication medium (e.g., e-mail).

### Disclosing asset metadata

In most cases, disclosing all asset metadata to a third party seems legitimate, but there are cases where we don't want a third party to know all about the assets we own. The 0xcert Protocol provides a powerful mechanism that supports selective metadata verification. This means we can expose only selected metadata properties and can keep the rest of the metadata private.

```ts
const selectedProperties = [
  ['name'],
  ['power'],
];
const exposedMetadata = cert.expose(metadata, selectedProperties);
const disclosedEvidence = await cert.disclose(metadata, selectedProperties);
```

This code snippet creates a subset of the metadata and the associated evidence object. In this case, only the `name` and `power` properties are disclosed. This is how you will usually create public asset data for the web or when disclosing private data for a specific user.

### Verifying asset information

Asset metadata is usually known only to the issuer and the owner of an asset. Both can reveal specific parts of the metadata to a third person at any time.

By now, we covered all the main technical aspects of the certification process. To better understand the concept and the purpose of the certification process, let's look at an imaginary use case where the content of our crypto-collectible needs to be verified by a third party. In this use case, the magic sword was issued to our Ethereum wallet by a trusted imaginary Troopers Game Studio. We trust the issuer, and we know the official asset ledger address because the issuer publishes it on their official public website.

Alright, so we own this awesome in-game item called the magic sword, and other players are dying to have it because of the power it represents within the Troopers game. At some point, we decide to transfer the ownership of this item to John, who is an avid gamer and understands the value of this in-game artifact. We offer John to transfer the ownership of this asset for a reasonable price, so we still make some profit. John agrees with the price, but he is not convinced that our offer is genuine. John is a smart guy and understands that by performing this purchase, we will be transferring ownership of an asset ID `12` but who knows what this ID actually represents. Before John is willing to perform this purchase, he wants to verify the authenticity of the crypto-collectible ID `12`. He is interested in the properties `id`, `name`, and `power`, so we disclose this information to him by following the certification steps from the previous chapter.

```ts
const selectedProperties = [
  ['id'],
  ['name'],
  ['power'],
];
const metadataForJohn = cert.expose(metadata, selectedProperties);
const evidenceForJohn = await cert.disclose(metadata, selectedProperties);
```

John can now recalculate the imprint on his computer from these artifacts.

```ts
const imprintByJohn = await cert.calculate(exposedMetadata, exposedEvidence);
```

John now verifies that the calculated imprint equals the imprint stored within the asset with ID `12`, stored in the asset ledger owned by the Troopers Game Studio. If the imprint is a match, it proves that we are telling the truth. John can now go ahead and perform the purchase because he was able to mathematically prove that the asset `12` indeed represents the magic sword he wants. 

Of course, in reality, John would use a dapp that would automate the whole process, leaving nothing to be done by hand. Such dapps would also provide other features like issuing and updating certificates, burning and revoking of certificates, tracking and logging, and much more.
