# @absolunet/tester

[![NPM version](https://img.shields.io/npm/v/@absolunet/tester.svg)](https://www.npmjs.com/package/@absolunet/tester)
[![Travis build](https://img.shields.io/travis/absolunet/node-tester/master.svg)](https://travis-ci.org/absolunet/node-tester/builds)
[![Dependencies](https://img.shields.io/david/absolunet/node-tester.svg)](https://david-dm.org/absolunet/node-tester)
[![Code style](https://img.shields.io/badge/code_style-@absolunet/node-463fd4.svg)](https://github.com/absolunet/eslint-config-node)

> Test suite for node projects via [🚀AVA](https://ava.li)


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

### ALL_JSON

Returns an `Array` with default paths for JSON files.

### ALL_YAML

Returns an `Array` with default paths for YAML files.

### ALL_SCSS

Returns an `Array` with default paths for SCSS files.

### ALL_BASH

Returns an `Array` with default paths for bash files.

### lintJs(*[patterns, options]*)

Lints files with ESLint via an [AVA](https://ava.li) test<br>
Uses [@absolunet/eslint-config-node](https://www.npmjs.com/package/@absolunet/eslint-config-node) shareable config

#### patterns

Type: `Array`<br>
Default: `ALL_JS`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns

#### options.configFile

Type: `String`<br>
Path to config file

#### options.configPreset

Type: `String`<br>
Name of shareable config



### lintJson(*[patterns, options]*)

Lints files with ESLint via an [AVA](https://ava.li) test<br>
Uses [JSON](https://www.npmjs.com/package/eslint-plugin-json) plugin

#### patterns

Type: `Array`<br>
Default: `ALL_JSON`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns



### lintYaml(*[patterns, options]*)

Lints files with [YAML Lint](https://www.npmjs.com/package/yaml-lint) via an [AVA](https://ava.li) test

#### patterns

Type: `Array`<br>
Default: `ALL_YAML`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns



### lintScss(*[patterns, options]*)

Lints files with stylelint via an [AVA](https://ava.li) test<br>
Uses user-defined config

#### patterns

Type: `Array`<br>
Default: `ALL_SCSS`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns

#### options.configFile

Type: `String`<br>
Path to config file

#### options.configPreset

Type: `String`<br>
Name of extendable config



### lintBash(*[patterns, options]*)

Lints files with `bash -n` via an [AVA](https://ava.li) test

#### patterns

Type: `Array`<br>
Default: `ALL_BASH`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns




## License

MIT © [Absolunet](https://absolunet.com)
