# API

## Asset Certificate

### Cert(options)

A `class` for certifying assets. It allows for creating asset imprints and evidence objects.

**Arguments**

| Argument | Description
|-|-|-
| schema | [required] An `object` representing the JSON-Schema definition.
| hasher | An `asynchronous` or `synchronous` `function` which accepts a `string` value and converts it into a hash. By default a  value is converted into SHA256 hash.

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
| proofs | [required] An `array` of proof `objcts`.

**Result:**

A `string` representing asset imprint or `null` when data don't match.

**Usage:**

```ts
// arbitrary data
const proofs = [
  {
    path: [],
    nodes: [
      { index: 1, hash: 'd747e6ffd1aa3f83efef2931e3cc22c653ea97a32c1ee7289e4966b6964ecdfb' },
      { index: 3, hash: '559aead08264d5795d3909718cdd05abd49572e84fe55590eef31a88a08fdffd' },
      { index: 5, hash: 'ab7a1a25348448f245bb0dcff7508d2a499051bfdb3e68d703bc5112199b20b0' },
      { index: 8, hash: '27939152348bd40d93319d31a98c99efd13d3234ef5c9abd1982902f4a1dae8c' },
    ],
    values: [
      { index: 3, value: 'B' },
    ],
  },
];
const data = {
  name: 'B',
};

// calculate imprint
const imprint = await cert.calculate(data, proofs);
```

### disclose(data, paths)

An `asynchronous` class instance `function` which generates the minimal list of proofs needed to verify the key `paths` of the provided `data` object. Use this function to prove the validity of only selected data keys to a third-party.

**Arguments:**

| Argument | Description
|-|-
| data | [required] An `object` with asset data which follows class schema definition.
| paths | [required] An `array` of `strings` representing JSON key paths.

**Result:**

An `array` of proofs.

**Usage:**

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

**Usage:**

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

**Usage:**

```ts
// arbitrary data
const data = {
  name: 'John',
};

// generate proofs
const proofs = await cert.notarize(data);
```

## Asset Proof

Asset proof represents the evidence object which describes a single level JSON object.

**Object:**


**Usage:**


## Asset Schema

- hosting
- headers
- evidence
- json-schema
