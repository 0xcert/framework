# Using Providers

The 0xcert Framework supports various providers that enable the communication with the Ethereum node and related services. Each provider operates on the same principles, but can also have its own special characteristics.

A popular front-end solution is [MetaMask](https://metamask.io/), a plug-in that allows you to create and store the private keys for your Ethereum account inside your browser or mobile device. It works as a bridge to the Ethereum blockchain through its own infrastructure. MetaMask can also be paired with your hardware wallet such as Ledger or Trezor.

On back-end, you can use HTTP provider via the [Infura](https://infura.io) web service, which enables the access to the Ethereum blockchain through their API. Advanced operations require a set-up of a local Ethereum node like [Geth](https://github.com/ethereum/go-ethereum/wiki/geth) or [Parity](https://www.parity.io), which give you a full control over the communication layer, your accounts, and private keys.

### Metamask Provider

MetaMask provider is applied for in-browser use. The user should have the [MetaMask](https://metamask.io) installed. The provider automatically establishes a communication channel with MetaMask, which further performs communication with the Ethereum blockchain through its own infrastructure.

#### Installation

We recommend that in your application you use the package as an NPM package.

```shell
$ npm i --save @0xcert/ethereum-metamask-provider
```

We also host compiled and minimized JavaScript file which you can directly include in your website on our official GitHub repository. The package adds the content on the `window.$0xcert` variable. You can use [jsdelivr](https://www.jsdelivr.com) to access these files on your website.

```html
<script src="https://cdn.jsdelivr.net/gh/0xcert/framework/dist/ethereum-metamask-provider.min.js" />
```

#### Usage

You start by creating a new provider instance.

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';

const provider = new MetamaskProvider();
```

Before you start interacting with the Ethereum node, you should check if the account has been enabled.

```ts
if (!provider.isEnabled()) {
    await provider.enable();
}
```
