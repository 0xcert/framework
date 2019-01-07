<img src="https://github.com/0xcert/framework/raw/master/assets/cover-sub.png" />

> Implementation of basic functions of binary Merkle tree.

This module handles binary trees like this:

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

A user defines an array of values `['A', 'B', 'C', 'D']`. These values can be hached into an `imprint`, which is a root tree hash. A user can expose selected values to a third-party by providing the evidence file which consists of `values` and `nodes`. This file holds enough information for a third-party to recreate an imprint.

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

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).
