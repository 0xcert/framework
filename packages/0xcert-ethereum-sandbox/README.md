<img src="../../assets/cover-sub.png" />

> Test server for local running testing of modules on the Ethereum blockchain.

You can use it as a standalone server.

```ts
import { Sandbox } from '@0xcert/ethereum-sandbox';

const sandbox = new Sandbox();
await sandbox.listen();
```

You can integrate it with Specron.

```ts
import { Spec } from '@specron/spec';
import { Protocol } from '@0xcert/ethereum-sandbox';

const spec = new Spec();

spec.before(async (stage) => {
  stage.set('protocol', await Protocol.deploy(stage.web3));
});

export default spec;
```

You can integrate it with Hayspec.

```ts
import { Spec } from '@hayspec/spec';
import { Sandbox } from '@0xcert/ethereum-sandbox';

interface Data {
  sandbox: Sandbox;
}

const spec = new Spec<Data>();

spec.before(async (stage) => {
  stage.set('sandbox', await Sandbox.listen());
  stage.set('protocol', stage.get('sandbox').protocol);
});

spec.after(async (stage) => {
  await stage.get('sandbox').close();
});

export default spec;
```

The [0xcert Framework](https://docs.0xcert.org) is a free and open-source JavaScript library that provides tools for building powerful decentralized applications. Please refer to the [official documentation](https://docs.0xcert.org) for more details.

This module is one of the bricks of the [0xcert Framework](https://docs.0xcert.org). It's written with [TypeScript](https://www.typescriptlang.org) and it's actively maintained. The source code is available on [GitHub](https://github.com/0xcert/framework) where you can also find our [issue tracker](https://github.com/0xcert/framework/issues).
