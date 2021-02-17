# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).






## [Unreleased]



## [4.1.3] - 2021-02-17
### Fixed
- Validate that sources ESLint uses `@absolunet/node-package`



## [4.1.2] - 2021-02-16
### Changed
- ESLint config update to 2.2.0
- Maintenance update

### Fixed
- Validate `dist` is ignored



## [4.1.1] - 2021-02-02
### Fixed
- Fix GitHub Actions path



## [4.1.0] - 2021-02-02
### Added
- Add cache flag for Bitbucket Pipelines cache (#15)

### Changed
- Migrate from TravisCI to GitHub Actions (#19)



## [4.0.3] - 2021-01-28
### Removed
- Remove macOS from TravisCI tests because of new TravisCI OSS policy



## [4.0.2] - 2021-01-28
### Fixed
- Corrections to support Node.js 10

### Removed
- Remove Windows from TravisCI tests because of LF/CRLF tests



## [4.0.1] - 2021-01-28
### Fixed
- Fix build step in CI engines config



## [4.0.0] - 2021-01-28
### Added
- `package-lock.json` now mandatory
- Add Node.js engine to multi-package projects, so we can validate CI engines config
- Add env NODE_ENV=test when running IoC tests (#14)

### Changed
- Update to Jest 26
- Update to ESLint 7
- ESLint config update to 2.1.0
- Update license to 2021
- Supports all stable active and maintenance LTS Node.js
- Validate that packages support some form of stable LTS Node.js versions
- Add build step to CI files, since `dist` are not committed anymore
- TravisCI tests multiple OSes
- Custom name scope only affect package name validation (#10)
- Bitbucket Pipelines `npm ci` instead of `npm install` (#17)
- Maintenance updates

### Removed
- Remove distribution from git repository

### Fixed
- Remove group type concept (#8, #9)
- Do not try to run tests on non-existing directories (#16)
- Bug on package source validation (#18)



## [3.2.2] - 2020-02-12
### Changed
- ESLint config update to 1.5.0
- Maintenance updates



## [3.2.1] - 2020-02-10
### Added
- Option in `.genericRepositoryTests()` to overwrite file matrix validation

### Changed
- Maintenance updates



## [3.2.0] - 2020-01-31
### Changed
- Validate that `lerna` is not a direct devDependency in multi-package projects, to be in sync with `@absolunet/manager` change in 2.1.0
- Maintenance updates

### Fixed
- Bitbucket Pipelines `npm install` without permissions changes so postinstall scripts work



## [3.1.3] - 2020-01-28
### Changed
- Test on latest Node.js + latest stable Node.js



## [3.1.2] - 2020-01-28
### Changed
- Update version support to consider latest major even version to be stable and latest odd version to be unstable
- Update to Jest 25
- Update license to 2020
- Maintenance updates

### Fixed
- Fixed calls to call IoC tests



## [3.1.1] - 2019-12-18
### Changed
- Maintenance updates

### Fixed
- Fixed calls to Jest to support Windows terminal
- Added `--passWithNoTests` flag to Jest call so it does not fail on subpackages not having all the same test types



## [3.1.0] - 2019-11-21
### Added
- Added `--errorOnDeprecated` flag on Jest call

### Changed
- Multi-packages tests are now run separately, with every subpackage managing its own tests
- Maintenance updates



## [3.0.5] - 2019-10-26
### Fixed
- Standards tests will run on Node IoC application



## [3.0.4] - 2019-10-23
### Fixed
- stylelint won't throw an error when ignoring a file via `.stylelintignore`



## [3.0.3] - 2019-10-21
### Fixed
- Added `bitbucket-pipelines.yml` to `.npmignore` matrix



## [3.0.2] - 2019-10-21
### Added
- Bitbucket Pipelines configuration identical to TravisCI

### Changed
- No more testing of latest Node.js LTS with TravisCI



## [3.0.1] - 2019-10-18
### Added
- TravisCI now tests on three Node.js version
  - Latest
	- Latest LTS
	- First version of latest version (X.0.0)

### Changed
- Added maintenance tool which auto-updates the license year and Node.js version in package.json engines
- Now validates that the engine version matches the tester



## [3.0.0] - 2019-10-17
### Added
- GitHub community files and validate them
  - `.github/ISSUE_TEMPLATE/*.md`
  - `.github/pull_request_template.md`
  - `code_of_conduct.md`
  - `contributing.md`
  - `security.md`
  - `support.md`
- Self-tests for initialization
- Scope validation

### Changed
- Change IoC tests responsabilities logic
- No more `jest-chain` plugin in generic tests (40% gain in speed)

### Removed
- No more `jest-chain` and `jest-expect-message` plugins in project tests (40% gain in speed)



## [3.0.0-rc.2] - 2019-10-11
### Added
- Added CHANGELOG.md validation following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) specifications

### Changed
- Update ESLint configurations



## [3.0.0-rc.1] - 2019-10-09
### Changed
- Update ESLint configurations
- Tests don't fail on ESLint warnings



## [3.0.0-beta.1] - 2019-10-04
### Changed
- Completely rewritten in Jest



## [2.6.11] - 2020-02-04
### Changed
- Update license to 2020
- Update to AVA 3
- Maintenance updates



## [2.6.10] - 2019-11-05
### Changed
- Update ESLint configurations
- Update stylelint configurations
- ESLint now reports useless disables
- Maintenance updates



## [2.6.9] - 2019-08-28
### Added
- Support `.eslintignore` during linting test phase



## [2.6.8] - 2019-05-27
### Removed
- Remove library-build task check since it uses manager



## [2.6.7] - 2019-05-17
### Fixed
- Correction for eslintconfig and styleconfig packages



## [2.6.6] - 2019-05-17
### Changed
- Update manager validation



## [2.6.5] - 2019-05-17
### Added
- Add manager validation



## [2.6.4] - 2019-04-24
### Added
- Support browser-only npm packages



## [2.6.3] - 2019-04-02
### Changed
- Structure change in library



## [2.6.2] - 2019-03-29
### Added
- Expose `ava` instance



## [2.6.1] - 2019-03-29
### Fixed
- Correct ESLint for library




## [2.6.0] - 2019-03-29
### Changed
- Update ESLint configurations
- Validate new library structure



## [2.5.0] - 2019-02-01
### Added
- Add grouping option



## [2.4.4] - 2019-01-17
### Changed
- Update to AVA 1.1.0
- Ajust copyright year



## [2.4.3] - 2018-11-30
### Added
- Add SCSS linting option to npm packages



## [2.4.2] - 2018-11-26
### Added
- Validate a single package inside a multi-packages project



## [2.4.1] - 2018-11-26
### Added
- Add stylelint in multi package projects



## [2.4.0] - 2018-11-22
### Added
- Add support for multi package projects



## [2.3.1] - 2018-10-30
### Fixed
- Remove `readme.md` from eclint



## [2.3.0] - 2018-10-26
### Added
- Add `npmPackage.validateStylelintConfig()`



## [2.2.0] - 2018-10-24
### Changed
- Update `@absolunet/eslint-config-node`



## [2.1.1] - 2018-09-11
### Fixed
- Ajust patterns



## [2.1.0] - 2018-07-25
### Added
- Add `npmPackage.validateLibrary()`



## [2.0.3] - 2018-07-14
### Fixed
- `.npmignore` still too restrictive



## [2.0.2] - 2018-07-14
### Fixed
- `.npmignore` too restrictive



## [2.0.0] - 2018-07-14
### Added
- Add npm package validators
- Add EditorConfig linter

### Changed
- Refactor



## [1.7.1] - 2018-06-14
### Changed
- Update `@absolunet/eslint-config-node`



## [1.7.0] - 2018-05-03
### Added
- Add YAML linter



## [1.6.0] - 2018-05-01
### Added
- Add JSON linter



## [1.5.0] - 2018-04-16
### Added
- Add configPreset for JS/SCSS



## [1.4.0] - 2018-03-07
### Changed
- Update `@absolunet/eslint-config-node`



## [1.3.0] - 2018-01-25
### Added
- Add cwd



## [1.2.0] - 2018-01-24
### Added
- Add SCSS tests via stylelint



## [1.1.0] - 2017-08-29
### Changed
- Update `@absolunet/eslint-config-node`



## [1.0.1] - 2017-06-29
### Changed
- Bash via Promises



## [1.0.0] - 2017-06-29
### Added
- [🚀AVA](https://ava.li) power



## [0.1.2] - 2017-06-14
### Changed
- Update `@absolunet/eslint-config-node`



## [0.1.1] - 2017-06-13
### Changed
- Native test



## [0.1.0] - 2017-06-13
### Changed
- Update `@absolunet/eslint-config-node`



## [0.0.5] - 2017-04-03
### Changed
- Shorten extend



## [0.0.4] - 2017-03-28
### Changed
- Exclude directories



## [0.0.3] - 2017-03-27
### Changed
- Update `@absolunet/eslint-config-node`



## [0.0.2] - 2017-03-25
### Changed
- Update `@absolunet/eslint-config-node`



## [0.0.1] - 2017-03-25
### Added
- Initial






[Unreleased]:   https://github.com/absolunet/node-tester/compare/4.1.3...HEAD
[4.1.3]:        https://github.com/absolunet/node-tester/compare/4.1.2...4.1.3
[4.1.2]:        https://github.com/absolunet/node-tester/compare/4.1.1...4.1.2
[4.1.1]:        https://github.com/absolunet/node-tester/compare/4.1.0...4.1.1
[4.1.0]:        https://github.com/absolunet/node-tester/compare/4.0.3...4.1.0
[4.0.3]:        https://github.com/absolunet/node-tester/compare/4.0.2...4.0.3
[4.0.2]:        https://github.com/absolunet/node-tester/compare/4.0.1...4.0.2
[4.0.1]:        https://github.com/absolunet/node-tester/compare/4.0.0...4.0.1
[4.0.0]:        https://github.com/absolunet/node-tester/compare/3.2.2...4.0.0
[3.2.2]:        https://github.com/absolunet/node-tester/compare/3.2.1...3.2.2
[3.2.1]:        https://github.com/absolunet/node-tester/compare/3.2.0...3.2.1
[3.2.0]:        https://github.com/absolunet/node-tester/compare/3.1.3...3.2.0
[3.1.3]:        https://github.com/absolunet/node-tester/compare/3.1.2...3.1.3
[3.1.2]:        https://github.com/absolunet/node-tester/compare/3.1.1...3.1.2
[3.1.1]:        https://github.com/absolunet/node-tester/compare/3.1.0...3.1.1
[3.1.0]:        https://github.com/absolunet/node-tester/compare/3.0.5...3.1.0
[3.0.5]:        https://github.com/absolunet/node-tester/compare/3.0.4...3.0.5
[3.0.4]:        https://github.com/absolunet/node-tester/compare/3.0.3...3.0.4
[3.0.3]:        https://github.com/absolunet/node-tester/compare/3.0.2...3.0.3
[3.0.2]:        https://github.com/absolunet/node-tester/compare/3.0.1...3.0.2
[3.0.1]:        https://github.com/absolunet/node-tester/compare/3.0.0...3.0.1
[3.0.0]:        https://github.com/absolunet/node-tester/compare/3.0.0-rc.2...3.0.0
[3.0.0-rc.2]:   https://github.com/absolunet/node-tester/compare/3.0.0-rc.1...3.0.0-rc.2
[3.0.0-rc.1]:   https://github.com/absolunet/node-tester/compare/3.0.0-beta.1...3.0.0-rc.1
[3.0.0-beta.1]: https://github.com/absolunet/node-tester/compare/2.6.11...3.0.0-beta.1
[2.6.11]:       https://github.com/absolunet/node-tester/compare/2.6.10...2.6.11
[2.6.10]:       https://github.com/absolunet/node-tester/compare/2.6.9...2.6.10
[2.6.9]:        https://github.com/absolunet/node-tester/compare/2.6.8...2.6.9
[2.6.8]:        https://github.com/absolunet/node-tester/compare/2.6.7...2.6.8
[2.6.7]:        https://github.com/absolunet/node-tester/compare/2.6.6...2.6.7
[2.6.6]:        https://github.com/absolunet/node-tester/compare/2.6.5...2.6.6
[2.6.5]:        https://github.com/absolunet/node-tester/compare/2.6.4...2.6.5
[2.6.4]:        https://github.com/absolunet/node-tester/compare/2.6.3...2.6.4
[2.6.3]:        https://github.com/absolunet/node-tester/compare/2.6.2...2.6.3
[2.6.2]:        https://github.com/absolunet/node-tester/compare/2.6.1...2.6.2
[2.6.1]:        https://github.com/absolunet/node-tester/compare/2.6.0...2.6.1
[2.6.0]:        https://github.com/absolunet/node-tester/compare/2.5.0...2.6.0
[2.5.0]:        https://github.com/absolunet/node-tester/compare/2.4.4...2.5.0
[2.4.4]:        https://github.com/absolunet/node-tester/compare/2.4.3...2.4.4
[2.4.3]:        https://github.com/absolunet/node-tester/compare/2.4.2...2.4.3
[2.4.2]:        https://github.com/absolunet/node-tester/compare/2.4.1...2.4.2
[2.4.1]:        https://github.com/absolunet/node-tester/compare/2.4.0...2.4.1
[2.4.0]:        https://github.com/absolunet/node-tester/compare/2.3.1...2.4.0
[2.3.1]:        https://github.com/absolunet/node-tester/compare/2.3.0...2.3.1
[2.3.0]:        https://github.com/absolunet/node-tester/compare/2.2.0...2.3.0
[2.2.0]:        https://github.com/absolunet/node-tester/compare/2.1.1...2.2.0
[2.1.1]:        https://github.com/absolunet/node-tester/compare/2.1.0...2.1.1
[2.1.0]:        https://github.com/absolunet/node-tester/compare/2.0.3...2.1.0
[2.0.3]:        https://github.com/absolunet/node-tester/compare/2.0.2...2.0.3
[2.0.2]:        https://github.com/absolunet/node-tester/compare/2.0.0...2.0.2
[2.0.0]:        https://github.com/absolunet/node-tester/compare/1.7.1...2.0.0
[1.7.1]:        https://github.com/absolunet/node-tester/compare/1.7.0...1.7.1
[1.7.0]:        https://github.com/absolunet/node-tester/compare/1.6.0...1.7.0
[1.6.0]:        https://github.com/absolunet/node-tester/compare/1.5.0...1.6.0
[1.5.0]:        https://github.com/absolunet/node-tester/compare/1.4.0...1.5.0
[1.4.0]:        https://github.com/absolunet/node-tester/compare/1.3.0...1.4.0
[1.3.0]:        https://github.com/absolunet/node-tester/compare/1.2.0...1.3.0
[1.2.0]:        https://github.com/absolunet/node-tester/compare/1.1.0...1.2.0
[1.1.0]:        https://github.com/absolunet/node-tester/compare/1.0.1...1.1.0
[1.0.1]:        https://github.com/absolunet/node-tester/compare/1.0.0...1.0.1
[1.0.0]:        https://github.com/absolunet/node-tester/compare/0.1.2...1.0.0
[0.1.2]:        https://github.com/absolunet/node-tester/compare/0.1.1...0.1.2
[0.1.1]:        https://github.com/absolunet/node-tester/compare/0.1.0...0.1.1
[0.1.0]:        https://github.com/absolunet/node-tester/compare/0.0.5...0.1.0
[0.0.5]:        https://github.com/absolunet/node-tester/compare/0.0.4...0.0.5
[0.0.4]:        https://github.com/absolunet/node-tester/compare/0.0.3...0.0.4
[0.0.3]:        https://github.com/absolunet/node-tester/compare/0.0.2...0.0.3
[0.0.2]:        https://github.com/absolunet/node-tester/compare/0.0.1...0.0.2
[0.0.1]:        https://github.com/absolunet/node-tester/releases/tag/0.0.1
