# API / Core

## Asset Certificate

Certification is the process of converting digital asset data into a piece of cryptographic evidence. Asset Certificate allows for creating and validating asset data. Each asset carries an imprint of a digital asset data object. It is a cryptographic hash which serves as decentralized evidence of a digital asset.

### Cert(options)

A `class` which allows for creating and managing asset imprints and evidence objects of an asset.

**Arguments**

| Argument | Description
|-|-|-
| schema | [required] An `object` representing the JSON-Schema definition.
| hasher | An `asynchronous` or `synchronous` `function` which accepts a `string` value and converts it into a hash. By default, the value is converted into SHA256 hash.

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

An `asynchronous` class instance `function` which returns an asset imprint when all the provided `data` are included in the evidence and are thus correctly described by the provided `proofs`. Note that custom data properties that are not described by the class schema will always be ignored and will thus always pass.

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
        hash: '89517c7ea48fd5075ef08dfac95517ae0f9b73d04f0cd0c17a4b9ee15ec52c5e',
      },
      {
        index: 1,
        hash: 'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
      },
      {
        index: 2,
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    ],
    values: [
      {
        index: 0,
        value: "John",
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

### imprint(data)

An `asynchronous` class instance `function` which generates asset imprint for the provided `data`.

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

**Example:**

```ts
const proofs = [
  {
    path: [],
    nodes: [
      {
        index: 0,
        hash: '89517c7ea48fd5075ef08dfac95517ae0f9b73d04f0cd0c17a4b9ee15ec52c5e',
      },
      {
        index: 1,
        hash: 'a8cfcd74832004951b4408cdb0a5dbcd8c7e52d43f7fe244bf720582e05241da',
      },
      {
        index: 2,
        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    ],
    values: [
      {
        index: 0,
        value: "John",
      },
    ],
  },
];
```

## Asset Schema

An asset is defined in the form of a specifically designed [JSON](https://en.wikipedia.org/wiki/JSON) object, which conforms to the [RFC-7159](https://en.wikipedia.org/wiki/JSON) and follows the mapping format defined by the [JSON Schema](http://json-schema.org/) specification. Each asset includes a URI which points to a publicly available [JSON](https://en.wikipedia.org/wiki/JSON) metadata file with additional public information about the asset.

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

```ts
import { sha } from '@0xcert/utils';

const schemaId = await sha(256, JSON.stringify(schema));
```

**Public Metadata:**

Public Metadata file must expose at least the keys defined by the [base asset schema](#asset-conventions).

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

Public Evidence is a notarized metadata object which proofs data validity of the Public Metadata.

```json
{
    "path": [],
    "nodes": [
      {
        "index": 0,
        "hash": "4810089a5685d9d005e1974b7b63e9d72107fedbd572c1dcd9cacdf77d26b6a1"
      },
      {
        "index": 1,
        "hash": "ad372c5ae525ff99fcdccffb92bad284414f0bd63c2c100c7e37d49d2a7044a5"
      },
      {
        "index": 2,
        "hash": "7e0ba8110ded7f470cf305ba84654c572326162c182c48ee49e19c986d91baba"
      },
      {
        "index": 3,
        "hash": "8a956a16769ec6008f55137c1ea19bfe64e0daef24cc531dbf5a70c3035a9277"
      },
      {
        "index": 4,
        "hash": "6c72bafb40b70773206890cd498b3e16feb244bde7dfc2a7eae0e80867f9cf1b"
      },
      {
        "index": 5,
        "hash": "1db479926d68a501aaabc3d9052f2369b40987395bed099796182667ab55e3f0"
      },
      {
        "index": 6,
        "hash": "a7650a807781364e91c86ddad3b491c943a64623a0bbfe39dc338412d2745750"
      },
      {
        "index": 7,
        "hash": "9f13cdc116bec37ff2ce3b52f5e8d75458b7b21b621b997f5cc1c5dc9755e3d5"
      },
      {
        "index": 8,
        "hash": "fe57a125a8377ddd78ac9e8000b3cc7bf695601d1c194192e12cac46e3005c97"
      },
      {
        "index": 9,
        "hash": "dab3414fe8e0c7e138d6304303185f45782c14f8fdc66133feb6681733495730"
      },
      {
        "index": 10,
        "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    ],
    "values": [
      {
        "index": 0,
        "value": "https://troopersgame.com/dog/evidence"
      },
      {
        "index": 1,
        "value": "http://json-schema.org/draft-07/schema"
      },
      {
        "index": 2,
        "value": "A weapon for the Troopers game which can severely injure the enemy."
      },
      {
        "index": 3,
        "value": "https://troopersgame.com/dog.jpg"
      },
      {
        "index": 4,
        "value": "Magic Sword"
      }
    ]
  }
]
```

**Asset Conventions:**

| Issue | Description
|-|-|-
| [86](https://github.com/0xcert/framework/blob/master/conventions/86-asset-metadata.md) | Basic asset data schema.
| [87](https://github.com/0xcert/framework/blob/master/conventions/87-asset-evidence.md) | Asset evidence data schema.
| [88](https://github.com/0xcert/framework/blob/master/conventions/88-crypto-collectible.md) | Schema describing digital collectible item.

Please propose a new convention by opening a [GitHub issue](https://github.com/0xcert/framework/issues).
