# Contributing

The 0xcert Framework is a mono repository with all framework-related packages stored in the `/packages` folder.

## Development

We use [RushJS](https://rushjs.io) to manage this repository. Some quick notes on how to manage the repository are documented [here](https://gist.github.com/xpepermint/eecfc6ad6cd7c9f5dcda381aa255738d). But here is a quick start to run the test suite if you have just cloned this repository and never used RushJS before. Expect to spend 10 minutes building and running this test suite for the first time. Subsequently testing any code will be faster, and you can limit testing to a specific package.

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

2. Deploy conventions to `conventions.0xcert.org`. We host v1 and v2 conventions on the same domain so make sure you don't delete the old content.

```sh
$ cd ./common/scripts
$ ./build-conventions.sh
```

3. Follow the guide in the [0xcert/docs](https://github.com/0xcert/docs/blob/master/CONTRIBUTING.md) repository to update and deploy the documentation. Make sure documentation pages describe the latest schemas.
