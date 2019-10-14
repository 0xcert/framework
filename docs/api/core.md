# API / Core

## Asset Certificate

Certification is the process of converting digital asset data into a piece of cryptographic evidence. Asset Certificate allows for creating and validating asset data. Each asset carries an imprint of a digital asset data object. It is a cryptographic hash which serves as decentralized evidence of a digital asset.

### Cert(options)

A `class` which allows for creating and managing asset imprints and evidence objects of an asset.

**Arguments**

| Argument | Description
|-|-
| schema | [required] An `object` representing the JSON-Schema definition.
| hasher | An `asynchronous` or `synchronous` `function` which accepts a value, path and merkle tree position and returns value hash. By default, the value is converted into SHA256 hash.
| noncer | An `asynchronous` or `synchronous` `function` which accepts value path and returns a nonce. By default, the value path is  converted into SHA256 hash.

**Usage**

```ts
import { Cert } from '@0xcert/cert';

const schema = {
  type: 'object',
  properties: {
    'name': {
      type: 'string',
    },
  },
};

const cert = new Cert({ schema });
```

### calculate(data, proofs)

An `asynchronous` class instance `function` which returns an asset imprint when all the provided `data` is included in the evidence and are thus correctly described by the provided `proofs`. Note that custom data properties that are not described by the class schema will always be ignored and will thus always pass.

**Arguments:**

| Argument | Description
|-|-
| data | [required] An `object` with asset data which follows class schema definition.
| proofs | [required] An `array` of proof `objects`.

**Result:**

A `string` representing asset imprint or `null` when data don't match.

**Example:**

```ts
// arbitrary data
const proofs = [
  {
    path: [],
    nodes: [
      {
        index: 0,
        hash: '7c8238509ade64f39e13b97eeeaca13b72e833cbf10db5b05dff43a7e22abce1',
      },
      {
        index: 1,
        hash: '33c8947ba1f4a97cdb44971f3b07b5131b2c8fdd39cdb2a65926c461fa5fa68b',
      },
      {
        index: 2,
        hash: 'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9',
      },
    ],
    values: [
      {
        index: 0,
        value: 'John',
        nonce: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
      },
    ],
  },
];
const data = {
  name: 'John',
};

// calculate imprint
const imprint = await cert.calculate(data, proofs);
```

### disclose(data, paths)

An `asynchronous` class instance `function` which generates a minimal list of proofs needed to verify the key `paths` of the provided `data` object. Use this function to prove the validity of only selected data keys to a third-party.

**Arguments:**

| Argument | Description
|-|-
| data | [required] An `object` with asset data which follows class schema definition.
| paths | [required] An `array` of `strings` representing JSON key paths.

**Result:**

An `array` of proofs.

**Example:**

```ts
// arbitrary data
const data = {
  name: 'John',
};
const paths = [
  ['name'],
];

// generate proofs
const proofs = await cert.disclose(data, paths);
```

### expose(data, paths)

A `synchronous` class instance `function` which creates a new object from `data` with only keys matching the provided `paths`. Use this function when creating public metadata JSON.

**Arguments:**

| Argument | Description
|-|-
| data | [required] An `object` with asset data which follows class schema definition.
| paths | [required] An `array` of `strings` representing JSON key paths.

**Result:**

A truncated data object with selected keys.

**Example:**

```ts
// arbitrary data
const data = {
  name: 'John',
  age: 36,
};
const paths = [
  ['name'],
];

// generate metadata
const metadata = await cert.expose(data, paths);
```

### identify(normalize)

An `asynchronous` class instance `function` which calculates schema ID.

**Arguments:**

| Argument | Description
|-|-
| normalize | A `boolean` which can disable object struction normalization (`true` by default).

**Result:**

A `string` representing schema hash.

**Example:**

```ts
// calculate schema ID
const schemaId = await cert.identify();
```

### imprint(data)

An `asynchronous` class instance `function` which generates asset imprint for the provided `data`.

::: warning
Please note that an imprint can sometimes be prepended with `0x`. You should manually remove this before passing it to the 0xcert Framework.
:::

**Arguments:**

| Argument | Description
|-|-
| data | [required] An `object` with asset data which follows class schema definition.

**Result:**

A `string` representing asset imprint.

**Example:**

```ts
// arbitrary data
const data = {
  name: 'John',
};

// generate imprint
const imprint = await cert.imprint(data);
```

### notarize(data)

An `asynchronous` class instance `function` which generates a full list of proofs needed to verify any key of the provided `data` object.

**Arguments:**

| Argument | Description
|-|-
| data | [required] An `object` with asset data which follows class schema definition.

**Result:**

An `array` of proofs.

**Example:**

```ts
// arbitrary data
const data = {
  name: 'John',
};

// generate proofs
const proofs = await cert.notarize(data);
```

## Asset Proof

Asset Proof represents a unit of the evidence object and describes a single level JSON object. The proof is used to verify the existence of some arbitrary data in the original data object of an asset which the imprint represents.

**Object:**

| Key | Description
|-|-
| nodes | An `array` of binary tree hashes.
| nodes.$.index | An `integer` number representing the hash index in a binary tree.
| nodes.$.hash | A `string` representing a hash node in a binary tree.
| path | An `array` of `strings` and `numbers` representing the JSON object key path.
| values | An `array` of binary tree values.
| values.$.index | An `integer` number representing the value index in a binary tree.
| values.$.value | A `string` representing a value in a binary tree.
| values.$.nonce | A `string` representing a secret for calculating merkle leaf.

**Example:**

```ts
const proofs = [
  {
    path: [],
    nodes: [
      {
        index: 0,
        hash: '7c8238509ade64f39e13b97eeeaca13b72e833cbf10db5b05dff43a7e22abce1',
      },
      {
        index: 1,
        hash: '33c8947ba1f4a97cdb44971f3b07b5131b2c8fdd39cdb2a65926c461fa5fa68b',
      },
      {
        index: 2,
        hash: 'e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9',
      },
    ],
    values: [
      {
        index: 0,
        value: 'John',
        nonce: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
      },
    ],
  },
];
```

## Asset Schema

An asset is defined in the form of a specifically designed [JSON](https://en.wikipedia.org/wiki/JSON) object, which conforms to the [RFC-7159](https://tools.ietf.org/html/rfc7159) and follows the mapping format defined by the [JSON Schema](http://json-schema.org/) specification. Each asset includes a URI which points to a publicly available [JSON](https://en.wikipedia.org/wiki/JSON) metadata file with additional public information about the asset.

**Example:**

```ts
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  description: 'An abstract digital asset schema.',
  properties: {
    $evidence: {
      description: 'A path to the evidence JSON with data needed to verify the asset.',
      type: 'string'
    },
    $schema: {
      description: 'A path to JSON Schema definition file.',
      type: 'string'
    },
    description: {
      description: 'A public property of type string that holds a detailed description of an asset. The property is always required and is limited to 255 characters.',
      type: 'string'
    },
    image: {
      description: 'A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and an aspect ratio between 1.91:1 and 4:5 inclusive.',
      type: 'string'
    },
    name: {
      description: 'A public property that holds a name of an asset. This property is required and is limited to 255 characters.',
      type: 'string'
    },
  },
  title: 'Asset',
  type: 'object',
};
```

**Schema ID:**

The schema ID is a hash which uniquely represents the data structure.

::: warning
Please note that a schema ID can sometimes be prepended with `0x`. You should manually remove this before passing it to the 0xcert Framework.
:::

```ts
import { Cert } from '@0xcert/cert';

const cert = new Cert({ schema });
const schemaId = await cert.identify();
```

**Public Metadata:**

Public Metadata file must expose at least the keys defined by the [base asset schema](https://github.com/0xcert/framework/blob/master/conventions/86-base-asset-schema.md).

```json
{
  "$evidence": "https://troopersgame.com/dog/evidence",
  "$schema": "http://json-schema.org/draft-07/schema",
  "description": "A weapon for the Troopers game which can severely injure the enemy.",
  "image": "https://troopersgame.com/dog.jpg",
  "name": "Magic Sword"
}
```

**Public Evidence:**

Public Evidence is a notarized metadata object which proofs data validity of the Public Metadata. The example below proofs `description` and `image` keys.

```json
{
    "$schema": "https://conventions.0xcert.org/87-asset-evidence-schema.json",
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

**Asset Conventions:**

| Issue | Id | Description
|-|-|-
| [86](https://conventions.0xcert.org/86-base-asset-schema.html) | 3c065f842bf043fb2380b968b3c22e105daaa24042c25fedc73445fd34f30e71 | Basic asset data schema.
| [87](https://conventions.0xcert.org/87-asset-evidence-schema.html) | ba47537e90fbfd7e33779556471e9122f3abc33016f96c2234ec29fb57315487 | Asset evidence data schema.
| [88](https://conventions.0xcert.org/88-crypto-collectible-schema.html) | b17216d996781173f5c97e36610d173a85335dfcccf785dcaaf4a3d1f71f5169 | Schema describing digital collectible item.

Please propose a new convention by opening a [GitHub issue](https://github.com/0xcert/framework/issues).
