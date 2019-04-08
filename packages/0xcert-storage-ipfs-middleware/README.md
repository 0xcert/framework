<img src="https://github.com/0xcert/framework/raw/master/assets/cover-sub.png" />

> IPFS storage express middleware.

Express middleware with LevelDB acts as an abstraction layer between ERC 721 token ids and IPFS naming system.

**Basic usage:**

```ts
const { StorageMiddleware } = require('@0xcert/storage-ipfs-middleware');
const storage = new StorageMiddleware({});

app.get('/storage/:id', storage.getter());
app.post('/storage/:id', storage.setter());
```

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).
