# Using providers

As explained previously, the 0xcert Framework tends to be platform-agnostic, meaning that it is not created for merely one blockchain or one specific platform. It aims to provide a consistently optimal developing experience, regardless of the platform you employ.

Each provider operates on the same principles, but can also have its own distinctive characteristics. The current version of the Framework supports the Ethereum and the Wanchain blockchain. Soon, more platforms will be added.

Even within the same blockchain, multiple providers are available depending on your needs. If you would like to communicate with blockchain on the front-end, you would use [MetamaskProvider](/api/ethereum.html#metamask-provider), while for communication on the back-end you would use [HttpProvider](/api/ethereum.html#http-provider). For more information about other providers for Ethereum such as Bitski, please click [here](/api/ethereum.html#api-ethereum), and to learn more about providers for Wanchain, please click [here](/api/wanchain.html#api-wanchain).

::: card Learn by example
Click [here](https://codesandbox.io/s/github/0xcert/example-using-providers?module=%2FREADME.md) to check the live example for this section.
:::

## Installation process

The 0xcert Framework supports multiple providers that enable the communication with platforms. However, in this guide, we will employ an example on the most common and straightforward blockchain provider called [MetaMask](https://metamask.io/), which allows for communication with the Ethereum network in the browser.

[MetaMask](https://metamask.io/) is a popular plug-in that allows you to create and store the private keys for your Ethereum account inside your browser or mobile device. It works as a bridge between your browser and the Ethereum blockchain through its own infrastructure. MetaMask can also be paired with hardware wallets such as [Ledger](https://www.ledger.com/) or [Trezor](https://trezor.io/).

We recommend you employ the provider module as an NPM package in your application.

```ell
$ npm i --save @0xcert/ethereum-metamask-provider
```

On our official [GitHub repository](https://github.com/0xcert/framework), we also host a compiled and minimized JavaScript file that can be directly implemented in your website. Please refer to the [API](/api/ethereum.html) section to learn more about other providers.

## Usage overview

To start developing the application, we have to first instantiate the [MetamaskProvider](/api/ethereum.html#metamask-provider) provider class. This is usually only needed once within the application.

```ts
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';

const provider = new MetamaskProvider();
```

MetaMask needs to be authorized and unlocked to be used on the website. This is specific to this provider. Therefore, before you start interacting with the Ethereum node, you should check whether the MetaMask account has been enabled. If not, you have to enable it, as shown in the example below.

```ts
if (!await provider.isEnabled()) {
    await provider.enable();
}
```

Now that we're connected to the Ethereum blockchain, we can begin performing `query` and `mutation` requests.

::: tip
When you connect to MetaMask, `provider.accountId` represents your selected account.
:::

::: tip
Make sure your MetaMask is connected to the Ethereum Ropsten network.
:::

::: tip
To perform this deployment step, you'll need to pay some gas on the Ethereum network. You can get free Ether into your wallet on the Ropsten network via [this link](https://faucet.ropsten.be/).
:::

---

Our connection to the blockchain is now successfully established. Next off, we will learn about [assets and how to use them](/guide/about-assets.html#assets-are-non-fungible) within our framework.
