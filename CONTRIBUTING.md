# Contributing

The 0xcert Framework is a mono repository with all framework related packages stored in the  `/packages` folder.

## Development

We use [RushJS](https://rushjs.io) to manage this repository. Some quick notes on how to manage the repository are documented [here](https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d). But here is a quick start to run the test suite if you have just cloned this repository and never used RushJS before. Expect to spend 10 minutes building and running this test suite for the first time. Subsequently testing any code will be faster, and you can limit testing to a specific package.

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

**Shortcut** -- Do this if only want to change and retest one package

```sh
rush rebuild -t @0xcert/conventions  # Where CONVENTIONS is the package you want
rush test -v -t @0xcert/conventions  # Where CONVENTIONS is the package you want
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
$ cp ./packages/0xcert-ethereum-erc20-contracts/build/token-mock.json ./docs/.vuepress/public/
$ cp ./packages/0xcert-ethereum-xcert-contracts/build/xcert-mock.json ./docs/.vuepress/public/
$ rush version --bump --override-bump minor
$ rush publish --publish --include-all
```

# 0xcet documentation

We are using VuePress for building the documentation pages. Start by installing the dependencies.

```
$ npm i -g vuepress
```

Then run the VuePress server in development mode.

```
$ npm dev docs
```

Files are built locally from `.md` files located in `/docs` folder and generated into a `/docs/.vuepress/dist` folder. To deploy the documentation, simply go to `/docs/.vuepress/` and run `deploy.sh` script.

```
$ cd ./docs/.vuepress/
$ ./deploy.sh
```
