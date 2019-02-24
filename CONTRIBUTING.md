# Contributing

The 0xcert Framework is a mono repository with all framework related packages stored in the  `/packages` folder.

## Development

We use [RushJS](https://rushjs.io) to manage this repository. Some quick notes on how to manage the repository are documented [here](https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d). But here is a quick start to run the test suite if you have just cloned this repository and never used RushJS before. Expect to spend 10 minutes building and running this test suite for the first time. Subsequently testing any code will take approximately 3 minutes and the full test suite must be run (even during development) for any change in any package.

**Install dependencies** -- You only need to run this once.

```sh
npm install -g @microsoft/rush
```

**Update packages** -- Run this if you add/remove packages from this repository.

```sh
rush update --full
```

**Rebuild and test** -- Do this each time you make changes to the code

```sh
rush rebuild --verbose
rush test --verbose
```

The above notes will help you decide which commands to run during development on your own machine. But for any commits and pull requests in this repository, the entire test suite will be run using continuous integration.

## Issues

We use GitHub issues to track bugs. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue.

## Pull requests

Always fork the repo and create your branch from master. If you've added code that should be tested, add tests. Alsp ensure the test suite passes before submitting the PR.

## Coding style

Please follow the [TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## Release process

The release manager will publish packages to NPM using these commands.

```sh
$ rush version --bump --override-bump minor
$ rush publish --publish --include-all
```

# 0xcet documentation

We are using VuePress for building the documentation pages. Files are built locally from `.md` files located in `/docs` folder and generated into a `/docs/.vuepress/dist` folder.

First, navigate to the root directory and install dependencies.

```
$ cd ./docs/.vuepress
$ npm i
```

You can start VuePress in development mode.

```
$ npm run dev
```

You can build and deploy the documentation to the servr.

```
$ npm run deploy
```

# 0xcet conventions

We are using VuePress for building the conventions pages. Files are built locally from `.md` files located in `/conventions` folder and generated into a `/convntions/.vuepress/dist` folder.

First, navigate to the root directory and install dependencies.

```
$ cd ./conventions/.vuepress
$ npm i
```

You can start VuePress in development mode.

```
$ npm run dev
```

You can build and deploy the conventions to the servr.

```
$ cp ../../packages/0xcert-ethereum-erc20-contracts/build/token-mock.json ..
$ cp ../../packages/0xcert-ethereum-xcert-contracts/build/xcert-mock.json ..
$ npm run deploy
```
