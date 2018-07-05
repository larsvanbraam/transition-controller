[![Travis](https://img.shields.io/travis/larsvanbraam/transition-controller.svg?maxAge=2592000)](https://travis-ci.org/larsvanbraam/transition-controller)
[![Code Climate](https://img.shields.io/codeclimate/github/larsvanbraam/transition-controller.svg?maxAge=2592000)](https://codeclimate.com/github/larsvanbraam/transition-controller)
[![npm](https://img.shields.io/npm/dm/transition-controller.svg?maxAge=2592000)](https://www.npmjs.com/package/transition-controller)
[![GitHub issues](https://img.shields.io/github/issues/larsvanbraam/transition-controller.svg?style=flat-square)](https://github.com/larsvanbraam/transition-controller/issues)

# AbstractTransitionController
An abstract transition controller that can be used for transitioning elements

## Installation

```sh
yarn add transition-controller
```

```sh
npm i -S transition-controller
```

## Documentation

### GitBook
- [General documentation](https://larsvanbraam.gitbook.io/transition-controller/)

### TypeDoc
- [Latest TypeDoc](https://larsvanbraam.github.io/transition-controller/docs/)
- [Older TypeDocs](https://transition-controller.larsvanbraam.nl)

## Example
I've included an example setup where you can see the transition controller in action, to run the project follow these steps:

- `git clone https://github.com/larsvanbraam/transition-controller.git`
- `cd transition-controller/example`
- `yarn`
- `yarn dev`
- Open your browser `localhost:8080`

or click [this link](https://larsvanbraam.github.io/transition-controller/example/) to preview online

## Building

In order to build transition-controller, ensure that you have [Git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/larsvanbraam/transition-controller.git
```

Change to the transition-controller directory:
```sh
cd transition-controller
```

Install dev dependencies:
```sh
yarn
```

Use one of the following main scripts:
```sh
yarn build            # build this project
yarn dev              # run compilers in watch mode, both for babel and typescript
yarn test             # run the unit tests incl coverage
yarn test:dev         # run the unit tests in watch mode
yarn lint             # run eslint and tslint on this project
yarn doc              # generate typedoc documentation
```

When installing this module, it adds a pre-commit hook, that runs lint and prettier commands
before committing, so you can be sure that everything checks out.

## Authors
View [AUTHORS.md](./AUTHORS.md)

## Contribute
View [CONTRIBUTING.md](./CONTRIBUTING.md)

## License
[MIT](./LICENSE) © Lars van Braam
