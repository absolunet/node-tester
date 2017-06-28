# @absolunet/tester

[![NPM version](https://img.shields.io/npm/v/@absolunet/tester.svg)](https://www.npmjs.com/package/@absolunet/tester)
[![Travis build](https://img.shields.io/travis/absolunet/node-tester/master.svg)](https://travis-ci.org/absolunet/node-tester/builds)
[![Dependencies](https://img.shields.io/david/absolunet/node-tester.svg)](https://david-dm.org/absolunet/node-tester)
[![Code style](https://img.shields.io/badge/code_style-@absolunet/node-463fd4.svg)](https://github.com/absolunet/eslint-config-node)

> Test suite for node projects


## Install

```sh
$ npm install @absolunet/tester
```


## Usage

```js
const tester = require('@absolunet/tester');

tester.lintJs(Object.assign({}, tester.ALL_JS, ['bin/*']));

tester.lintBash(['install-scripts/**/*']);
```


## API

### ALL_JS

Returns an `Array` with default paths for javascript files.

### ALL_BASH

Returns an `Array` with default paths for bash files.

### lintJs([patterns])

Lints files with ESLint via a [Mocha](https://mochajs.org/) test<br>
Uses [@absolunet/eslint-config-node](https://www.npmjs.com/package/@absolunet/eslint-config-node) shareable config

#### patterns

Type: `Array`<br>
Default: `ALL_JS`<br>
glob patterns

### lintBash([patterns])

Lints files with `bash -n` via a [Mocha](https://mochajs.org/) test

#### patterns

Type: `Array`<br>
Default: `ALL_BASH`<br>
glob patterns



## License

MIT © [Absolunet](https://absolunet.com)
