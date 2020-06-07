# Contributing

The 0xcert Framework is a mono repository with all framework-related packages stored in the `/packages` folder.

## Development

We use [RushJS](https://rushjs.io) to manage this repository. Some quick notes on how to manage the repository are documented [here](https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d). But here is a quick start to run the test suite if you have just cloned this repository and never used RushJS before. Expect to spend 10 minutes building and running this test suite for the first time. Subsequently testing any code will be faster, and you can limit testing to a specific package.

On Mac OS, install development tools by running `xcode-select --install` and follow the instructions [here](https://github.com/nodejs/node-gyp/issues/1861#issuecomment-543022396) if you experience issues with `node-gyp`.

**Install dependencies** -- You only need to run this once.

```
npm install -g @microsoft/rush
```

**Update packages** -- Run this if you add/remove packages from this repository.

```
rush update --full
```

**Rebuild and test** -- Do this each time you make changes to the code

```
rush rebuild --verbose
rush test --verbose
```

The above notes will help you decide which commands to run during development on your own machine. But for any commits and pull requests in this repository, the entire test suite will be run using continuous integration.

## Issues

We use GitHub issues to track bugs. Please ensure your description is clear and has sufficient instructions so that we can reproduce the issue.

## Pull requests

Always fork the repository and create your branch from master. If you've added code that should be tested, add tests. Also, ensure the test suite passes before submitting the PR.

## Coding style

Please follow the [TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## Release process

1. Run the commands below to push all packages to NPM:

```sh
$ rush version --bump --override-bump minor
$ rush update --full
$ rush rebuild
$ rush test
$ rush publish --publish --include-all
```

2. Deploy conventions to `conventions.0xcert.org`. We host v1 and v2 conventions on the same domain so make sure you don't delete the old content. Note that v2 conventions are built from the active master branch and v1 conventions are copied from `common/conventions-v1` folder.

```sh
$ cd ./common/scripts
$ ./build-conventions.sh
$ cd ../..
```

3. Follow the guide in the [0xcert/docs](https://github.com/0xcert/docs/blob/master/CONTRIBUTING.md) repository to update and deploy the documentation. Make sure documentation pages describe the latest schemas.

## Smart contract deploy

Fueling 0xcert framework is the 0xcert protocol which consists for multiple smart contracts which are located in `0xcert/ethereum-gateway-contracts` and `0xcert/ethereum-proxy-contracts` packages. To automate deployment and configuration of this contracts we created a deploy script. Deploy script(`deploy-protocol.sh`) is located in `common/scripts/`.

### Prerequisites

Depending on which network you want to deploy (Ethereum / Wanchain) you need a running node of the network with 2 unlocked accounts which own their designated cryptocurrencies(ETH/WAN).
To find out how to do this you can check [this](https://0xcert.org/news/0xcert-framework-tutorial-1-run-and-prepare-geth-node-for-backend-integration/) tutorial for Ethereum network and [this](https://0xcert.org/news/0xcert-framework-for-wanchain-tutorial-1-run-and-prepare-wanchain-test-node-for-backend-integration) for Wanchain.

### Usage

Navigate to `/common/scripts` then deploy the protocol:

```sh
GATEWAY_DEPLOYER_ACCOUNT=0x... PROXY_DEPLOYER_ACCOUNT=0x... ./deploy-protocol.sh
```

** List of possible input parameters **

| Key | Description
|-|-
| GATEWAY_DEPLOYER_ACCOUNT | A `string` representing the Ethereum address from which gateway contracts will be deployed.
| NETWORK | A `string` representing the name of the network to which we are deploying. Can be either `ethereum` or `wanchain`. It is `ethereum` by default.
| PROXY_DEPLOYER_ACCOUNT | A `string` representing the Ethereum address from which proxy contracts will be deployed.
| WEB3_URL | A `string` representing URI to you node. `http://localhost:8545` by default.
