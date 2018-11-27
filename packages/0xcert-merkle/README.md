
## Getting started

First, define an array with values.

```ts
const values = ['A', 'B', 'C', 'D'];
```

The evidence for this array of values is a simple binary merkle tree as shown below.

```ts
    n0
    |
---------
|       |
n1      n2
A       |
    ---------
    |       |
    n3      n4
    B       |
        ---------
        |       |
        n5      n6
        C       |
            ---------
            |       |
            n7      n8
            D       empty
```

A user can expose selected values from this tree by providing the evidence file that looks like this:

```ts
const recipe = {
  values: [
    { index: 0, value: 'A' },
    { index: 1, value: 'B' },
    { index: 2, value: 'C' },
    ...
  ],
  nodes: [
    { index: 0, hash: '0x...' }, // n0 (root)
    { index: 1, hash: '0x...' }, // n1
    { index: 2, hash: '0x...' }, // n2
    ...
  ],
};
```

Note, that the root hash is never part of the evidence object!

## Usage

Create an instance of a merkle tree.

```js
import { sha } from '@0xcert/utils'; 
import { Merkle } from '@0xcert/merkle'; 

const merkle = new Merkle({
  hasher: (v) => sha(256, v),
});
const values = ['A', 'B', 'C', 'D', 'E'];
const expose = [2, 3];
const recipe = await merkle.notarize(values);
const evidence = await merkle.disclose(recipe, expose);
const imprint = await merkle.imprint(evidence);
```

## License (MIT)

```
Copyright (c) 2018 Kristijan Sedlak <xpepermint@gmail.com>

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
