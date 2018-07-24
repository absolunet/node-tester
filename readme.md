# @absolunet/tester

[![npm](https://img.shields.io/npm/v/@absolunet/tester.svg)](https://www.npmjs.com/package/@absolunet/tester)
[![npm dependencies](https://david-dm.org/absolunet/node-tester/status.svg)](https://david-dm.org/absolunet/node-tester)
[![npms](https://badges.npms.io/%40absolunet%2Ftester.svg)](https://npms.io/search?q=%40absolunet%2Ftester)
[![Travis CI](https://api.travis-ci.org/absolunet/node-tester.svg?branch=master)](https://travis-ci.org/absolunet/node-tester/builds)
[![Code style](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config-node)

> Test suite for Node.js projects via [🚀AVA](https://ava.li)


## Install

```sh
$ npm i @absolunet/tester
```


## Usage

```js
const tester = require('@absolunet/tester');

tester.lint.js(Object.assign({}, tester.all.js, ['bin/*']));

tester.lint.bash(['install-scripts/**/*']);
```


## API - Patterns

### all.js

Returns an `Array` with default paths for javascript files.

### all.json

Returns an `Array` with default paths for JSON files.

### all.yaml

Returns an `Array` with default paths for YAML files.

### all.scss

Returns an `Array` with default paths for SCSS files.

### all.bash

Returns an `Array` with default paths for bash files.

### all.editorconfig

Returns an `Array` with default paths for EditorConfig files.




## API - Linters

### lint.js(*[paths, options]*)

Lints files with ESLint via an [AVA](https://ava.li) test<br>
Uses [@absolunet/eslint-config-node](https://www.npmjs.com/package/@absolunet/eslint-config-node) shareable config

#### paths

Type: `Array`<br>
Default: `all.js`<br>
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



### lint.json(*[paths, options]*)

Lints files with ESLint via an [AVA](https://ava.li) test<br>
Uses [JSON](https://www.npmjs.com/package/eslint-plugin-json) plugin

#### paths

Type: `Array`<br>
Default: `all.json`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns



### lint.yaml(*[paths, options]*)

Lints files with [YAML Lint](https://www.npmjs.com/package/yaml-lint) via an [AVA](https://ava.li) test

#### paths

Type: `Array`<br>
Default: `all.yaml`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns



### lint.scss(*[paths, options]*)

Lints files with stylelint via an [AVA](https://ava.li) test<br>
Uses user-defined config

#### paths

Type: `Array`<br>
Default: `all.scss`<br>
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



### lint.bash(*[paths, options]*)

Lints files with `bash -n` via an [AVA](https://ava.li) test

#### paths

Type: `Array`<br>
Default: `all.bash`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns



### lint.editorconfig(*[paths, options]*)

Lints files with [ECLint](https://www.npmjs.com/package/eclint) via an [AVA](https://ava.li) test

#### paths

Type: `Array`<br>
Default: `all.editorconfig`<br>
glob patterns

#### options.cwd

Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for patterns




## API - npm package

### npmPackage.validate()

Validates a npm package repo with Absolunet's standards.




## License

MIT © [Absolunet](https://absolunet.com)
