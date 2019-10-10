"use strict";

exports.default = void 0;

var _marked = _interopRequireDefault(require("marked"));

var _semver = _interopRequireDefault(require("semver"));

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _environment = _interopRequireDefault(require("../../helpers/environment"));

var _paths = _interopRequireDefault(require("../../helpers/paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Repository - Changelog tests
//--------------------------------------------------------
const extractValues = (raw, pattern) => {
  const {
    groups = {}
  } = raw.match(pattern) || {};
  return groups;
};

const parseFile = file => {
  const parsedText = _fss.default.readFile(file, 'utf8');

  const tokens = _marked.default.lexer(parsedText);

  const header = tokens.splice(0, 4);
  let unreleased = false;
  const releases = tokens.filter(({
    type,
    depth,
    text
  }) => {
    if (type === 'heading' && depth === 2) {
      if (text !== '[Unreleased]') {
        return true;
      }

      unreleased = true;
    }

    return false;
  }).map(({
    text
  }) => {
    const {
      version,
      date
    } = extractValues(text, /^\[(?<version>.+)\] - (?<date>\d{4}-\d{2}-\d{2})$/u);
    return {
      version,
      date,
      raw: text
    };
  });
  const types = tokens.filter(({
    type,
    depth
  }) => {
    return type === 'heading' && depth === 3;
  }).map(({
    text
  }) => {
    return text;
  });
  const links = Object.keys(tokens.links);
  return {
    header,
    unreleased,
    releases,
    types,
    links
  };
};

var _default = () => {
  const FILE = 'CHANGELOG.md';
  const filePath = `${_paths.default.project.root}/${FILE}`;
  const {
    header,
    unreleased,
    releases,
    types,
    links
  } = parseFile(filePath);
  describe(`Validate ${_environment.default.getReadablePath(_paths.default.project.root)}/${FILE} respects 'Keep a Changelog'`, () => {
    test(`Ensure header is valid`, () => {
      expect(header, 'Header must be identical').toEqual([{
        type: 'heading',
        depth: 1,
        text: 'Changelog'
      }, {
        type: 'paragraph',
        text: 'All notable changes to this project will be documented in this file.'
      }, {
        type: 'space'
      }, {
        type: 'paragraph',
        text: 'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).'
      }]);
    });
    test(`Ensure unreleased heading is valid`, () => {
      expect(unreleased, 'File must contain an unreleased heading').toBeTrue();
      expect(links, 'Unreleased must have a link').toContain('unreleased');
    });
    test(`Ensure current version is documented`, () => {
      const versions = releases.map(({
        version
      }) => {
        return version;
      });
      expect(versions, 'Release headings must contain current version').toContain(_environment.default.version);
    });
    releases.forEach(({
      version,
      date,
      raw
    }) => {
      test(`Ensure release heading '${raw}' is valid`, () => {
        expect(version, 'Version must be valid').toBe(_semver.default.valid(version));
        expect(links, 'Version must have a link').toContain(version);
        expect(Date.parse(date), 'Date must be valid').not.toBeNaN();
      });
    });
    test(`Ensure type headings are valid`, () => {
      types.forEach(type => {
        expect(['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'], 'Type heading must be in whitelist').toContain(type);
      });
    });
  });
};

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;