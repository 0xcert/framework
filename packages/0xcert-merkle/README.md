
## Getting started

First, define an array with values.

| Value | Type | Description
|-|-|-
| 1 | String | First name of a user.
| 2 | String | Middle name of a user.
| 3 | String | Last name of a user.
| 4 | String | Email address of a user.
| 5 | Integer | Age of a user.

This can be converted into a merkle tree where leafs represent the values and the root represents the proof.

```ts
                ROOT
                |
    -----------------------
    |                     |
    h12                   h11
    A                     |
        ---------------------------
        |                         |
        h10                       h7
    ---------                     |
    |       |                     |
    h8      h9                    |
    B       C                     |
                ---------------------------
                |                         |
                h6                        h1
    -------------------------             |
    |       |       |       |             | 
    h2      h3      h4      h5            |
    D       E       F       G             empty
```

```ts
const exposed = [
  { // level root
    level: 2,
    index: -1, // root hash
    hash: 'c',
  },
  { // level hash 
    level: 2,
    index: 0, // item b
    hash: 'b',
  },
  { // level value
    level: 2,
    index: 1, // item c
    value: 'c',
    nonce: '-',
  },
];
```

## Usage

Create an instance of a merkle tree.

```js
import { sha256 } from '@0xcert/crypto'; 
import { Merkle } from '@0xcert/merkle'; 

const merkle = new Merkle({
  algo: sha256,
});
```

Build merkle tree nodes from a list of values.

```ts
const allNodes = merkle.build([
  { index: 0, value: 'a' },
  { index: 1, value: 'b' },
  { index: 2, value: 'c' },
  { index: 3, value: 'd' },
  { index: 4, value: 'e' },
]);
```

Create a minimal list of nodes from which a tree root can be calculated.

```ts
const recipeNodes = await merkle.pack(
  allNodes, 
  [0, 2] // expose values `a` and `c`
);
```

Recalculate the tree root hash object.

```ts
const rootNode = await merkle.calculate([
  // values
  { index: 0, value: 'a' },
], [
  // nodes
  { level: 1, index: 0, hash: '0x...' },
  { level: 1, index: 1, hash: '0x...' },
  { level: 2, index: 0, hash: '0x...' },
], 4);
```

## License (MIT)

```
Copyright (c) 2017+ Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated modelation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
