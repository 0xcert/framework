
# Interface

Certification is the process of converting digital asset metadata into cryptographic artifacts, which can be used to verify the authenticity of metadata.

### Installation

We recommend you employ the certification module as an NPM package in your application.

```sh
$ npm i --save @0xcert/cert
```

On our official open-source [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript files that can be directly implemented into your application or website. Please also refer to the [API Reference](/api/core.html) section to learn more about certification.

### Cert(options)

A `class` which allows for creating and managing certification artifacts.

**Arguments**

| Argument | Description
|-|-
| schema | [required] An `object` representing the JSON Schema definition.
| hasher | An `asynchronous` or `synchronous` `function` which accepts a value, path, and Merkle tree position, and returns value hash. By default, the value is converted into a SHA256 hash.
| noncer | An `asynchronous` or `synchronous` `function` which accepts value path and returns a nonce. By default, the value path is converted into a SHA256 hash.

**Usage**

```ts
import { Cert } from '@0xcert/cert';

const schema = {
  properties: {
    'name': {
      type: 'string',
    },
  },
  type: 'object',
};

const cert = new Cert({ schema });
```

### calculate(metadata, evidence)

An `asynchronous` class instance `function` which returns asset imprint when all the provided `metadata` is correctly included in the `evidence` object. Note that custom metadata properties that are not described by the asset schema will always be ignored and will thus always pass.

**Arguments:**

| Argument | Description
|-|-
| metadata | [required] An `object` with asset information which follows schema definition.
| evidence | [required] An `object` which describes and prooves metadata object.

**Result:**

A `string` representing asset imprint or `null` when metadata doesn't match.

**Example:**

```ts
// arbitrary data
const evidence = {
  $schema: 'https://0xcert.org/conventions/87-asset-evidence-schema.json',
  data: [...],
};
const metadata = {
  name: 'John',
};

// calculate imprint
const imprint = await cert.calculate(metadata, evidence);
```

### disclose(metadata, paths)

An `asynchronous` class instance `function` which generates an `evidence` for the subset of the metadata. The selected properties are provided as object `paths`.

::: tip
It's a good practice to always include `$schema` and `$evidence` properties in the metadata object.
:::

**Arguments:**

| Argument | Description
|-|-
| metadata | [required] An `object` with asset information which follows schema definition.
| paths | [required] An `array` of `string`s representing JSON key paths.

**Result:**

An `array` of proofs.

**Example:**

```ts
// arbitrary data
const metadata = {
  name: 'John',
};
const paths = [
  ['name'],
];

// generate evidence
const evidence = await cert.disclose(metadata, paths);
```

### expose(metadata, paths)

A `synchronous` class instance `function` which creates a new object from `metadata` with only the keys matching the provided `paths`.

::: tip
It's a good practice to always include `$schema` and `$evidence` properties in the metadata object.
:::

**Arguments:**

| Argument | Description
|-|-
| metadata | [required] An `object` with asset information which follows schema definition.
| paths | [required] An `array` of `string`s representing JSON key paths.

**Result:**

Truncated metadata object with selected keys.

**Example:**

```ts
// arbitrary data
const metadata = {
  name: 'John',
  age: 36,
};
const paths = [
  ['name'],
];

// generate subset of metadata
const metadataSubset = await cert.expose(metadata, paths);
```

### identify(normalize)

An `asynchronous` class instance `function` which calculates the schema ID.

**Arguments:**

| Argument | Description
|-|-
| normalize | A `boolean` which can disable object structure normalization (`true` by default).

**Result:**

A `string` representing schema ID.

**Example:**

```ts
// calculate schema ID
const schemaId = await cert.identify();
```

### imprint(metadata)

An `asynchronous` class instance `function` which generates asset imprint for the provided `metadata`.

::: warning
Please note that an imprint can sometimes be prepended with `0x`. You should manually remove this before passing it to the 0xcert Framework.
:::

**Arguments:**

| Argument | Description
|-|-
| metadata | [required] An `object` with asset information which follows schema definition.

**Result:**

A `string` representing asset imprint.

**Example:**

```ts
// arbitrary data
const metadata = {
  name: 'John',
};

// generate imprint
const imprint = await cert.imprint(metadata);
```

### notarize(metadata)

An `asynchronous` class instance `function` which generates a full object metadata certification evidence that is needed to verify any key of the provided `metadata` object.

::: tip
It's a good practice to always include `$schema` and `$evidence` properties in the metadata object.
:::

**Arguments:**

| Argument | Description
|-|-
| metadata | [required] An `object` with asset information which follows schema definition.

**Result:**

An `array` of proofs.

**Example:**

```ts
// arbitrary data
const metadata = {
  name: 'John',
};

// generate proofs
const evidence = await cert.notarize(metadata);
```

### Asset evidence

Asset evidence represents a JSON object which holds information of the disclosed metadata and is needed when verifying asset metadata.

**Object:**

| Key | Description
|-|-
| $schema | URL to JSON schema definition.
| data.$.nodes | An `array` of binary tree hashes.
| data.$.nodes.$.index | An `integer` number representing the hash index in a binary tree.
| data.$.nodes.$.hash | A `string` representing a hash node in a binary tree.
| data.$.path | An `array` of `strings` and `numbers` representing the JSON object key path.
| data.$.values | An `array` of binary tree values.
| data.$.values.$.index | An `integer` number representing the value index in a binary tree.
| data.$.values.$.value | A `string` representing a value in a binary tree.
| data.$.values.$.nonce | A `string` representing a secret for calculating merkle leaf.

**Example:**

```ts
const evidence = {
  $schema: 'https://0xcert.org/conventions/87-asset-evidence-schema.json',
  data: [
    {
      path: [],
      nodes: [
        {
          index: 0,
          hash: '7c8238509ade64f39e13b97eeeaca13b72e833cbf10db5b05dff43a7e22abce1',
        },
        ...
      ],
      values: [
        {
          index: 0,
          value: 'John',
          nonce: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9',
        },
        ...
      ],
    },
    ...
  ],
};
```

## @0xcert/conventions

This module provides interfaces for all the confirmed application data conventions.

Yes, the 0xcert Conventions are simply JSON objects, and you could create them yourself. But we have created this simple module to bring you type-safe TypeScript goodness.

| Issue | Id | Description
|-|-|-
| [xcert](https://0xcert.org/conventions/xcert-schema.html) | e1823a17bb5dd039e2aff7d997223efed50dbeebb0fcb60cf7bba2a9b6f90140 | JSON Schema definition describing asset schema capabilities.
| [86](https://0xcert.org/conventions/86-base-asset-schema.html) | 9a7531dd7ac3ed4e3d2fa61d20a825cfd4be7f3e6bc540c82d9dc94b526c5123 | Basic asset data schema.
| [87](https://0xcert.org/conventions/87-asset-evidence-schema.html) | 02edbb4f2d07017d0ae9148af683a63d4b86d0d357a5019dd794d377a1523e9e | Asset evidence data schema.
| [88](https://0xcert.org/conventions/88-crypto-collectible-schema.html) | cd3d7fce94669724f964061572f42ae0391996b0e348c7431251f9ab1bab0f49 | Schema describing digital collectible item.

**Example:**

```ts
import { Schema86, schema86 } from '@0xcert/conventions';

// Schema88: Typescript interface
// schema86: JSON object
```

We incentivize the community to agree on standard schema conventions. Schema conventions should be proposed and included in the official [0xcert repository on GitHub](https://github.com/0xcert). Please propose a new convention by opening a [GitHub issue](https://github.com/0xcert/framework/issues).

## 0xcert algorithms

The 0xcert Protocol provides two hashing algorithms. The Asset Imprint Hashing algorithm (AIH) is used for generating asset fingerprints, and the Asset Schema Hashing algorithm (ASH) generates a schema unique identifier.

### Asset Imprint Hashing algorithm (AIH)

The AIH algorithm uses [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree) and [SHA256](https://en.wikipedia.org/wiki/SHA-2) cryptographic concepts to transform the JSON metadata object into cryptographic `imprint` and `evidence` object.

The artifacts are created based on several rules: 
* Only the properties defined by the asset schema are included in the certification process.
* Each object is flattened into an array of values based on alphabetically ordered key names.
* Each value is stringified and hashed through the `sha256` hash function.
* An autogenerated `nonce` is added to each hashed value.
* Nonced values are hashed through `sha256` hash function.
* Each array is hashed to a root hash of a binary tree.
* The last value of each array is an empty string. 
* Binary tree structure details are pushed to `evidence` object for each property path that holds an object.
* The root hash of the binary tree of the root object represents an `imprint`.

Let's see how this works in practice with a simple imprint. We will be using a static nonces `@` so you can easily follow the steps.

```ts
const metadata = {
  id: 'A',
  education: {
    skills: ['C', 'D'],
    degree: 'E',
  },
};
const evidence = {
  '$schema': 'https://conventions.0xcert.org/87-asset-evidence-schema.json',
  'data': [],
};
```

Processing starts at leaves. The process will follow the rules described earlier and will start by calculating the binary tree of the `evidence.skills` property. The following graph illustrates the hashing mechanism where (`v` = value, `h` = hash, `r` = nonce, `n` = node; `v0` = C, `v1` = D).

```
       n0
       |
   ---------
   |       |
   n1      n2
   |       |
|-----|    |
h0    r0   |
|          |
v0         |
      ---------
      |       |
      n3      n4
      |       |
   |-----|    |
   h1    r1   r2
   |
   v1
```

The snippet below shows how the result for the `evidence.skills` property should look like.

```ts
const metadata = {
  id: 'A',
  education: {
    skills: '6914baafaff31f3b671257da2fbc4346f6a219d2e47010853b41d27866dbb4ae', // root hash
    degree: 'E',
  },
};
const evidence = {
  ...
  'data': [
    {
      'path': ['education', 'skills'],
      'nodes': [
        { 'index': 0, 'hash': '6914baafaff31f3b671257da2fbc4346f6a219d2e47010853b41d27866dbb4ae' }, // root hash
        { 'index': 1, 'hash': '772a324c1f21c8db4c6ab02a03cb61cf129068e02c4cdb1e65e5da1df09fedab' },
        { 'index': 2, 'hash': '92bc65cb3bae38c59c2fa47559d22dee1c73fcc3d3ef1019a43d34a7f248c910' },
        { 'index': 3, 'hash': '0ce11497c2d0b8f0f47696ef2bf3b4c87d92f0b17c7d87440025210bc8ffbe9e' },
        { 'index': 4, 'hash': 'c3641f8544d7c02f3580b07c0f9887f0c6a27ff5ab1d4a3e29caf197cfc299ae' },
      ],
      'values': [
        { 'index': 0, 'value': 'C', 'nonce': '@' },
        { 'index': 1, 'value': 'D', 'nonce': '@' },
      ],
    },
  ],
};
```

The process is repeated for the `education` property.

```ts
const metadata = {
  id: 'A',
  education: '625b80bb24d3a7be910c351d800322d9d1778b509d5f3304fbe7a5dd17df4934', // root hash
};
const evidence = {
  ...
  'data': [
    {
      'path': ['education'],
      'nodes': [
        { 'index': 0, 'hash': '625b80bb24d3a7be910c351d800322d9d1778b509d5f3304fbe7a5dd17df4934' }, // root hash
        { 'index': 1, 'hash': '5c61b5867c3da57ccc680c0d19c91da8d2a97e1ee968b70c5dd358798e9210f2' },
        { 'index': 2, 'hash': '4c943871f0ac653a8f4b36915b0eb68db9f97491aed7edf801dc398212f354d0' },
        { 'index': 3, 'hash': 'd095436cd874aa6647547f6717046d3e9890b155a239d6d598a519d5e3504d97' },
        { 'index': 4, 'hash': 'c3641f8544d7c02f3580b07c0f9887f0c6a27ff5ab1d4a3e29caf197cfc299ae' },
      ],
      'values': [
        { 'index': 0, 'value': 'E', 'nonce': '@' },
        { 'index': 1, 'value': '6914baafaff31f3b671257da2fbc4346f6a219d2e47010853b41d27866dbb4ae', 'nonce': '@' },
      ],
    },
    ...
  ],
};
```

Finally, the process is repeated for the root properties.

```ts
const metadata = {
  id: 'A',
  education: '625b80bb24d3a7be910c351d800322d9d1778b509d5f3304fbe7a5dd17df4934', // root hash
};
const evidence = {
  ...
  'data': [
    {
      'path': [],
      'nodes': [
        { 'index': 0, 'hash': 'becc3f4e2f8069e5fd46045392235ade6dbc07a74f4473c58983e11a00c8ae78' },
        { 'index': 1, 'hash': '1e84369077b0e3c0dbb10c03cf44cff8ffe040fdef6a3de4d1b7d432a4cd92b1' },
        { 'index': 2, 'hash': '5bbe0178d6941d92b53cee28f611290e8cce4afde3d10c8237169aa4b3025e1c' },
        { 'index': 3, 'hash': '1e84369077b0e3c0dbb10c03cf44cff8ffe040fdef6a3de4d1b7d432a4cd92b1' },
        { 'index': 4, 'hash': '743d8c749207bc570957ef67b2fc205fb4a267329a743092f93c798a11e8a7cf' },
        { 'index': 5, 'hash': '094e90f0e366ed93dc96d67ec2d221e4aa79a9f27b57692e4c77eff4a93ffbac' },
        { 'index': 6, 'hash': '334cdb61ab77ca02890fbd96cee53422b6c3242a9458f8347b9eea9c276c26c5' },
        { 'index': 7, 'hash': '80a47e3b308d978595a200d5db06d514671af7081c0f358a4fb8a6d96f91cbae' },
        { 'index': 8, 'hash': 'c3641f8544d7c02f3580b07c0f9887f0c6a27ff5ab1d4a3e29caf197cfc299ae' },
      ],
      'values': [
        { 'index': 0, 'nonce': '@' },
        { 'index': 1, 'nonce': '@' },
        { 'index': 2, 'value': '625b80bb24d3a7be910c351d800322d9d1778b509d5f3304fbe7a5dd17df4934', 'nonce': '@' },
        { 'index': 3, 'value': 'A', 'nonce': '@' },
      ],
    },
    ...
  ],
};
```

The `data[0].nodes[0].hash` path is the root hash which represents asset imprint and should be saved to the blockchain.

### Asset Schema Hashing algorithm (ASH)

The ASH algorithm uses [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash function to transform the JSON schema object to a cryptographic `schema ID` which uniquely identifies an asset schema.

The artifact is created based on these rules: 
* Schema object keys are sorted in alphabetical order.
* Schema object is stringified and hashed through the `sha256` hash function.

Let's see how this works in practice with a simple schema.

```ts
const schema = {
  '$schema': 'https://0xcert.org/conventions/xcert-schema.json',
  'properties': {
    '$schema': {
      'type': 'string',
    },
    '$evidence': {
      'type': 'string',
    },
    'id': {
      'type': 'string',
    },
    'name': {
      'type': 'string',
    },
    'image': {
      'type': 'string',
    },
    'power': {
      'type': 'number',
    },
  },
  'title': 'Cryptocollectible',
  'type': 'object',
};
```

The algorithm first sorts all the keys in alphabetic order.

```ts
const schema = {
  '$schema': 'https://0xcert.org/conventions/xcert-schema.json',
  'properties': {
    '$evidence': { ... },
    '$schema': { ... },
    'name': { ... },
    'power': { ... },
  },
  'title': 'Cryptocollectible',
  'type': 'object',
};
```

The schema is then stringified and converted to a hash.

```ts
const schemaId = '95e70b916a247557c7b1508368f1a34ec1379f23aa63e960a50e8acd639fda90';
```
