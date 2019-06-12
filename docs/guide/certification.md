# Certification

Various industries follow different standards. A standard reflects a need for defining a certain best practice and for establishing rules in a particular process or for a specific product. Today, companies and institutions mostly define their own rules of communication, operation, processes, and the format of stored and managed data. To establish more effective communication among them, the concept of system interoperability becomes increasingly valuable. As this idea develops over time, we will see companies and organizations choose interoperable systems more often.

The [ERC-721](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) has given us a powerful standard. The 0xcert Framework is an opinionated framework that apart from the general development guidelines of the standard also provides a scaffold for defining conventions above the data objects. Each asset within the 0xcert Framework represents a JSON data object, structured on the definitions in a data scheme based on a [JSON-schema](https://json-schema.org/).

![0xcert framework](../assets/scheme_3.svg)

0xcert provides an interface for the application layer where developers need to act in a fast and agile way. To ensure interoperability among applications in the future, assets follow specific conventions. These will prevent incompatibility on a higher level, which might happen when every NFT issuer deploys their own version of an industry standard. Having this level of standardization built on top of the ERC-721 standard prevents high-level fragmentation and safeguards the long-term sustainability.

## Explaining the process

The result of the certification process are objects that allow third-party to verify the proof of existence, authenticity, and ownership of these digital assets without a middleman's involvement.

![0xcert framework](../assets/certification.svg)

When creating an asset, we start to prepare a digital structure of data represented by the asset. During this process, we first create a cryptographic `imprint` based on the asset data. Such imprint constitutes a cryptographic proof of the asset data and should be stored on a public blockchain or similar distributed systems, so that third parties are able to use it as a public asset proof.

The original data of an asset is usually known only to the issuer and the owner of the asset. Both can reveal a specific part of the data to a third person anytime, while a third party can verify such data based on a publicly available `imprint`. For this purpose, the issuer or the owner creates an `evidence` file that contains the revealed data and proofs needed for a third party to calculate the `imprint` once more. If the calculated imprint matches the publicly available imprint, it means that the revealed data indeed exists in the original data object.

The process of certification is based on the [Binary Tree](https://en.wikipedia.org/wiki/Binary_tree) concept, a well-known mechanism in the world of cryptography. To create a cryptographic hash string, the 0xcert Framework employs the [sha256](https://en.wikipedia.org/wiki/SHA-2) algorithm. Within the Framework, this complexity is hidden from the developer's interaction but available via simple functions provided by the API. See the [@0xcert/merkle](https://github.com/0xcert/framework/tree/master/packages/0xcert-merkle) and [@0xcert/cert](https://github.com/0xcert/framework/tree/master/packages/0xcert-cert) modules for the in-depth information about this algorithm.

According to the [ERC-721 Metadata](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md) standard, a token includes a URI which points to the public token metadata JSON file. This JSON provides additional asset metadata information. The 0xcert Protocol makes this mandatory and expects every token to provide that. The metadata file must include information about the schema convention and should also point to the evidence file which allows a third-party to prove the values in the public metadata. We explain this further later in the chapter.

## Conventions

As explained earlier, the 0xcert Framework provides data models that allow your application to interoperate with other applications using the 0xcert Framework. Additionally, conventions enable imprints, a tamper-evident system, for assuring data consistency in which some of the data can be public while others can be private.

Conventions that are approved, representing best practices in the industry, can be found in [this package](https://github.com/0xcert/framework/tree/master/conventions) on GitHub. These conventions are public. You can use these as-is or derive your own specific version of them or create your own conventions from scratch.

Please see the [base asset schema](https://github.com/0xcert/framework/blob/master/conventions/86-base-asset-schema.md) as an example of the convention format. Also, every convention must adopt this base asset schema.

::: card Learn by example
Click [here](https://stackblitz.com/edit/certification-example) to check the live example for this section.
:::

## Installation

We recommend you employ the certification module as an NPM package in your application.

```shell
$ npm i --save @0xcert/cert
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that can be directly implemented in your website. Please refer to the [API](/api/core.html) section to learn more about certification.

## Usage overview

In the following guide, we will create a simple asset that represents a crypto collectible. We will define a JSON data object of the asset, create its cryptographic imprint, and show how to reveal data to a third party.

To start, we create a simple JSON object that represents our crypto collectible item. We will define the data object based on the [#88](https://conventions.0xcert.org/88-crypto-collectible-schema.html) convention which describes crypto collectible items. It's advised to store this data into a local database to keep its original structure and have it at our disposal in the future.

```ts
import { Object88, schema88 } from '@0xcert/conventions';

const data = {
    description: 'A weapon for the Troopers game which can severely injure the enemy.',
    image: 'https://troopersgame.com/dog.jpg',
    name: 'Magic Sword'
} as Object88;
```

In the 0xcert Framework, the whole complexity of certification is packed into the `Cert` class. Therefore, we create a new instance of that class with the appropriate JSON Schema definition for our data object.

```ts
import { Cert } from '@0xcert/cert';
import { schema88 } from '@0xcert/conventions';

const cert = new Cert({
    schema: schema88,
});
```

We can now create a cryptographic imprint for our crypto collectible that we will need in the following sections of this guide.

```ts
const imprint = await cert.imprint(data);
// => 642c19d1a7f27bbe601defe6d730ea321d60b156d73fc814bd62ce8ed8640b5d
```

This long string returned by the `imprint` method represents a cryptographic proof of the original asset data object. We will store this string on the Ethereum blockchain in one of the following sections, where we'll show how to handle asset ledgers.

In the previous [section](/guide/about-assets.html#explaining-the-concept), we mentioned that each asset also holds its URI, pointing to the asset's publicly available metadata. We should put metadata and other public files to a publicly available HTTP location. We can either establish an HTTP server ourselves, or we can host the file through services like Amazon and Google.

At this point, we have to decide which data we want to expose publicly and which we want to store internally. For the purpose of this guide, we choose to publicly disclose `description` and `image`; while we retain the `name` privately for us as the issuers.

```ts
const metadata = cert.expose(data, [
    ['description'],
    ['image'],
]);
// => { description: ..., image: ... }
```

We also need to create evidence data. These recipes will enable third parties to recalculate asset imprint to verify and prove the validity of the public metadata above.

```ts
const evidence = await cert.disclose(data, [
    ['description'],
    ['image'],
]);
// => [{ path, nodes, values }, ...]
```

The content obtained with the functions above can now be published on the public HTTP location. Let's assume that the public metadata file will be available at `https://troopersgame.com/sword/100.json` and its evidence file is available at `https://troopersgame.com/sword/100-evidence.json`

The metadata URL should respond with the `metadata` object that looks like the one below:

```json
{
  "$evidence": "https://troopersgame.com/sword/100-evidence.json",
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/sword/100.jpg"
}
```

The evidence URL should respond with the `evidence` object like these:

```json
{
    "$schema": "http://json-schema.org/draft-07/schema",
    "data": [
        {
            "path": [],
            "nodes": [
                {
                    "index": 1,
                    "hash": "9b61df344ebc1740d60333efc401150f756c3e3bc13f9ca31ddd96b8fc7180fe"
                },
                {
                    "index": 3,
                    "hash": "d95a266f24ca0ca79539cb3620832d9d37b415023002e8748458d34da53ccc1b"
                },
                {
                    "index": 8,
                    "hash": "3ef34334173d794cfc862c2f05580975ba10bea41e7ff2c60164a8288dee0cc6"
                }
            ],
            "values": [
                {
                    "index": 2,
                    "value": "A weapon for the Troopers game which can severely injure the enemy.",
                    "nonce": "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35"
                },
                {
                    "index": 3,
                    "value": "https://troopersgame.com/dog.jpg",
                    "nonce": "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce"
                }
            ]
        }
    ]
}
```

Finally, let's discuss the concept of revealing data to third parties. This works in the same way as we created the evidence file for the published metadata JSON file. When we want to reveal a private `name` data to a third person, we would also employ the `disclose` function to create the evidence data, and then send it via arbitrary communication channel which would allow them to calculate the `imprint` of the original data object based on the revealed data and the received evidence data. If the calculated imprint matches the one that is publicly available on the blockchain, the data will count as valid.

Certification offers other additional possibilities. For more details, please refer to the [API](/api/core.html) section.

---

Next, we proceed to [creating our assets](/guide/asset-management.html#installation)