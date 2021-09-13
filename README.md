# @absolunet/tester

[![npm][npm-badge]][npm-url]
[![npm dependencies][dependencies-badge]][dependencies-url]
[![Tests][tests-badge]][tests-url]
[![npms][npms-badge]][npms-url]
[![License: MIT][license-badge]][license-url]

> Test suite for JavaScript projects via [🃏 Jest](https://jestjs.io)


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
import { tester } from '@absolunet/tester';

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

See the [full documentation](https://documentation.absolunet.com/node-tester) for an in-depth look.

See the [Changelog](CHANGELOG.md) to see what has changed.


## Contribute

See the [Contributing Guidelines](CONTRIBUTING.md) for ways to get started.

See the [Support Guide](SUPPORT.md) for ways to get help.

See the [Security Policy](SECURITY.md) for sharing vulnerability reports.

This project has a [Code of Conduct](CODE_OF_CONDUCT.md).
By interacting with this repository, organization, or community you agree to abide by its terms.


## License

[MIT](LICENSE) © [Absolunet](https://absolunet.com)




[npm-badge]:          https://img.shields.io/npm/v/@absolunet/tester?style=flat-square
[dependencies-badge]: https://img.shields.io/david/absolunet/node-tester?style=flat-square
[tests-badge]:        https://img.shields.io/github/workflow/status/absolunet/node-tester/tests/production?label=tests&style=flat-square
[npms-badge]:         https://badges.npms.io/%40absolunet%2Ftester.svg?style=flat-square
[license-badge]:      https://img.shields.io/badge/license-MIT-green?style=flat-square

[npm-url]:          https://www.npmjs.com/package/@absolunet/tester
[dependencies-url]: https://david-dm.org/absolunet/node-tester
[tests-url]:        https://github.com/absolunet/node-tester/actions?query=workflow%3Atests+branch%3Aproduction
[npms-url]:         https://npms.io/search?q=%40absolunet%2Ftester
[license-url]:      https://opensource.org/licenses/MIT
