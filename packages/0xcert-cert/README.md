<img src="https://github.com/0xcert/framework/raw/master/assets/cover-sub.png" />

> Asset certification module for 0xcert Framework.

```ts
// Define arbitrary data object.
const data = { ... };

// Define certificate with JSON schema definition.
const cert = new Cert({ schema: { ... } });

// Calculates schema ID
const id = await cert.identify();

// Notarize data object (returns all recipes for all data keys).
const evidence = await cert.notarize(data);

// Expose selected data keys (returns recipes and exposed values from which an imprint can be calculated).
const evidence = await cert.disclose(data, [ ...paths ]);

// Verify data object against recipes generated with function `disclose` (if object is valid, an imprint is the root hash).
const imprint = await cert.calculate(data, recipes);

// Generate root hash from complete data object.
const imprint = await cert.imprint(data);
```

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).
