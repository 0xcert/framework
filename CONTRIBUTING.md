# Contributing

The 0xcert Framework is a mono repository with all framework related packages stored in the  `/packages` folder.

## Development

We use [RushJS](https://rushjs.io) to manage this repository. Some quick notes on how to manage the repository are documented [here](https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d).

## Issues

We use GitHub issues to track bugs. Please ensure your description is clear and has sufficient instructions to be able to reproduce the issue.

## Pull requests

Always fork the repo and create your branch from master. If you've added code that should be tested, add tests. Alsp ensure the test suite passes before submitting the PR.

## Coding style

Please follow the [TypeScript coding guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines).

## Repository management

Install dependencies.

```
npm install -g @microsoft/rush
```

Update packages, rebuild and test.

```
$ rush update --full
$ rush rebuild
$ rush text
```

Check dependencies of each package.

```
$ rush check
```

Publish to NPM.

```
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
