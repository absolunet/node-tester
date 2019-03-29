# @absolunet/tester

[![npm](https://img.shields.io/npm/v/@absolunet/tester.svg)](https://www.npmjs.com/package/@absolunet/tester)
[![npm dependencies](https://david-dm.org/absolunet/node-tester/status.svg)](https://david-dm.org/absolunet/node-tester)
[![npms](https://badges.npms.io/%40absolunet%2Ftester.svg)](https://npms.io/search?q=%40absolunet%2Ftester)
[![Travis CI](https://api.travis-ci.org/absolunet/node-tester.svg?branch=master)](https://travis-ci.org/absolunet/node-tester/builds)
[![Code style](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config)

> Test suite for Node.js projects via [🚀AVA](https://ava.li)


## Install

```sh
$ npm install @absolunet/tester
```


## Usage

```js
const tester = require('@absolunet/tester');

tester.lint.js(Object.assign({}, tester.all.js, ['bin/*']));

tester.lint.bash(['install-scripts/**/*']);
```


## API - Dependencies

### ava
Returns `ava` instance



<br>

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



<br>

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

#### options.group
Type: `String`<br>
Grouping id for test names

#### options.configFile
Type: `String`<br>
Path to config file

#### options.configPreset
Type: `String`<br>
Name of shareable config



<br>

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

#### options.group
Type: `String`<br>
Grouping id for test names



<br>

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

#### options.group
Type: `String`<br>
Grouping id for test names



<br>

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

#### options.group
Type: `String`<br>
Grouping id for test names

#### options.configFile
Type: `String`<br>
Path to config file

#### options.configPreset
Type: `String`<br>
Name of extendable config



<br>

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

#### options.group
Type: `String`<br>
Grouping id for test names



<br>

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

#### options.group
Type: `String`<br>
Grouping id for test names



<br>

## API - npm package

### npmPackage.multiPackagesPaths
Returns an `Array` with each package path in a multi-packages project.



<br>

### npmPackage.validate(*[options]*)
Validates a npm package repo with Absolunet's standards.

#### options.cwd
Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for validation

#### options.group
Type: `String`<br>
Grouping id for test names

#### options.scope
Type: `String`<br>
Default: `''`<br>
Scope for matrix testing

#### options.js
Type: `Array`<br>
Default: `all.js`<br>
glob patterns

#### options.json
Type: `Array`<br>
Default: `all.json`<br>
glob patterns

#### options.yaml
Type: `Array`<br>
Default: `all.yaml`<br>
glob patterns

#### options.bash
Type: `Array`<br>
Default: `all.bash`<br>
glob patterns

#### options.editorconfig
Type: `Array`<br>
Default: `all.editorconfig`<br>
glob patterns

#### options.scss
Type: `Array`<br>
glob patterns



<br>

### npmPackage.validateMulti(*[options]*)
Validates a multi-packages repo with Absolunet's standards. (Only the wrapper not the packages inside)

#### options.cwd
Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for validation

#### options.group
Type: `String`<br>
Default: `MAIN`<br>
Grouping id for test names

#### options.scope
Type: `String`<br>
Default: `''`<br>
Scope for matrix testing

#### options.js
Type: `Array`<br>
Default: `all.js`<br>
glob patterns

#### options.json
Type: `Array`<br>
Default: `all.json`<br>
glob patterns

#### options.yaml
Type: `Array`<br>
Default: `all.yaml`<br>
glob patterns

#### options.bash
Type: `Array`<br>
Default: `all.bash`<br>
glob patterns

#### options.editorconfig
Type: `Array`<br>
Default: `all.editorconfig`<br>
glob patterns

#### options.scss
Type: `Array`<br>
glob patterns



<br>

### npmPackage.validateSub(*[options]*)
Validate a single package inside a multi-packages project with Absolunet's standards.

#### options.cwd
Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for validation

#### options.group
Type: `String`<br>
Grouping id for test names

#### options.scope
Type: `String`<br>
Default: `''`<br>
Scope for matrix testing

#### options.js
Type: `Array`<br>
Default: `all.js`<br>
glob patterns

#### options.json
Type: `Array`<br>
Default: `all.json`<br>
glob patterns

#### options.yaml
Type: `Array`<br>
Default: `all.yaml`<br>
glob patterns

#### options.bash
Type: `Array`<br>
Default: `all.bash`<br>
glob patterns

#### options.editorconfig
Type: `Array`<br>
Default: `all.editorconfig`<br>
glob patterns

#### options.scss
Type: `Array`<br>
glob patterns



<br>

### npmPackage.validateEslintConfig(*[options]*)
Validates a npm package repo for ESLint config with Absolunet's standards.

#### options.cwd
Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for validation

#### options.group
Type: `String`<br>
Grouping id for test names



<br>

### npmPackage.validateStylelintConfig(*[options]*)
Validates a npm package repo for stylelint config with Absolunet's standards.

#### options.cwd
Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for validation

#### options.group
Type: `String`<br>
Grouping id for test names



<br>

### npmPackage.validateLibrary(*[options]*)
Validates a npm package repo for JS Library with Absolunet's standards.

#### options.cwd
Type: `String`<br>
Default: `process.cwd()`<br>
Base directory for validation

#### options.group
Type: `String`<br>
Grouping id for test names



<br>

## License

MIT © [Absolunet](https://absolunet.com)
