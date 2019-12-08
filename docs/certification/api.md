# Certification API

## @0xcert/cert

Certification is the process of converting digital asset metadata into cryptographic artifacts which can be used to verify the authenticity of metadata.

### Cert(options)

A `class` which allows for creating and managing certification artifacts.

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

A `string` representing asset imprint or `null` when metadata don't match.

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
| paths | [required] An `array` of `strings` representing JSON key paths.

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
| paths | [required] An `array` of `strings` representing JSON key paths.

**Result:**

A truncated metadata object with selected keys.

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
| normalize | A `boolean` which can disable object struction normalization (`true` by default).

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
  ],
};
```

## @0xcert/conventions

// TODO
