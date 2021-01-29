# @absolunet/tester

[![npm](https://img.shields.io/npm/v/@absolunet/tester.svg)](https://www.npmjs.com/package/@absolunet/tester)
[![npm dependencies](https://david-dm.org/absolunet/node-tester/status.svg)](https://david-dm.org/absolunet/node-tester)
[![npms](https://badges.npms.io/%40absolunet%2Ftester.svg)](https://npms.io/search?q=%40absolunet%2Ftester)
[![tests](https://github.com/absolunet/node-tester/workflows/tests/badge.svg?branch=master)](https://github.com/absolunet/node-tester/actions?query=workflow%3Atests+branch%3Amaster)
[![Code style](https://img.shields.io/badge/code_style-@absolunet/node-659d32.svg)](https://github.com/absolunet/eslint-config)

> Test suite for JavaScript projects via [🃏Jest](https://jestjs.io)


## Install

```sh
$ npm install @absolunet/tester
```


## Usage

In your `./package.json` file add
```json
{
	"scripts": {
		"test":             "node test --scope=all",
		"test:standards":   "node test --scope=standards",
		"test:unit":        "node test --scope=unit",
		"test:feature":     "node test --scope=feature",
		"test:integration": "node test --scope=integration",
		"test:endtoend":    "node test --scope=endtoend"
	}
}
```


In a `./test/index.js` file
```js
const tester = require('@absolunet/tester');

tester.init({
	repositoryType: 'single-package',
	packageType:    'simple'
});
```


In a `./test/generic/index.test.js` file
```js
import { tester } from '@absolunet/tester';

tester.genericRepositoryTests();
```


## Custom tests
Under `./test/[TYPE]/` folders, add your `*.test.js` Jest files.

**Available [TYPE]s are:**
- `standards`
- `unit`
- `feature`
- `integration`
- `endtoend`


## Documentation

View [documentation](https://documentation.absolunet.com/node-tester)






<br><br>

## License

MIT © [Absolunet](https://absolunet.com)
