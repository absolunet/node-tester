# @absolunet/tester

[![npm](https://img.shields.io/npm/v/@absolunet/tester.svg)](https://www.npmjs.com/package/@absolunet/tester)
[![npm dependencies](https://david-dm.org/absolunet/node-tester/status.svg)](https://david-dm.org/absolunet/node-tester)
[![npms](https://badges.npms.io/%40absolunet%2Ftester.svg)](https://npms.io/search?q=%40absolunet%2Ftester)
[![Travis CI](https://api.travis-ci.org/absolunet/node-tester.svg?branch=master)](https://travis-ci.org/absolunet/node-tester/builds)
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
		"test": "node test --scope=all",
		"test:standard": "node test --scope=standard",
		"test:feature": "node test --scope=feature",
		"test:unit": "node test --scope=unit"
	}
}
```


In a `./test/index.js` file
```js
const tester = require('@absolunet/tester');

tester.run(options);
```



<br>

## License

MIT © [Absolunet](https://absolunet.com)
