<img src="../../assets/cover-sub.png" />

> Implementation of basic functions of a binary Merkle tree.

This module handles binary trees like this (v = value, n = node, r = nonce):

```ts
       n0
       |
   ---------
   |       |
   n1      n2
   |       |
|-----|    |
v0    r0   |
      ---------
      |       |
      n3      n4
      |       |
   |-----|    |
   v1    r1   r2
```

A user defines an array of values where these values are hashed into an `imprint`, which is a Merkle root tree hash. A user can expose selected values to a third-party by providing the evidence file which includes a recipe of `values` and `nodes`. This file holds enough information for a third-party to recreate the imprint.

```js
import { sha } from '@0xcert/utils'; 
import { Merkle } from '@0xcert/merkle'; 

const merkle = new Merkle({
  hasher: (v, p, k) => sha(256, v),
  noncer: (p) => Math.random().toString(36).substring(7),
});
const values = ['A', 'B', 'C', 'D', 'E'];
const expose = [2, 3];
const fullRecipe = await merkle.notarize(values);
const minRecipe = await merkle.disclose(fullRecipe, expose);
const imprint = await merkle.imprint(minRecipe);
```

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).
