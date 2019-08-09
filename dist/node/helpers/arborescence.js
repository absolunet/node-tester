"use strict";

exports.default = void 0;

var _fss = _interopRequireDefault(require("@absolunet/fss"));

var _paths = _interopRequireDefault(require("./paths"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--------------------------------------------------------
//-- Arborescence helper
//--------------------------------------------------------
const EDITORCONFIG = Symbol('editorconfig');
const ESLINTRC = Symbol('eslintrc');
const GITIGNORE = Symbol('gitignore');
const NPMIGNORE = Symbol('npmignore');
const MANAGER = Symbol('manager');
const PACKAGE = Symbol('package');
const TRAVIS = Symbol('travis');
const TEST = Symbol('test');

const extractEntries = filename => {
  return _fss.default.readFile(filename, 'utf8').split(`\n`).filter(Boolean);
};

const matrix = (filename, type) => {
  const cleaned = filename.replace(/^(?<prefix>(?<remove>[\w./-])+\/)?\.(?<filename>[\w./-]+)/u, `$<prefix>$<filename>`);
  const rootPath = `${_paths.default.root}/${filename}`;
  const matrixPath = `${_paths.default.matrix}/${cleaned}`;
  const typePath = `${_paths.default.matrix}/${type}/${cleaned}`;

  if (_fss.default.exists(typePath)) {
    return _fss.default.realpath(typePath);
  } else if (_fss.default.exists(matrixPath)) {
    return _fss.default.realpath(matrixPath);
  }

  return _fss.default.realpath(rootPath);
};
/**
 * xyz
 */


class Arborescence {
  /**
   * xyz
   */
  fileExists(filename, {
    path,
    readablePath
  }) {
    const exists = _fss.default.exists(`${path}/${filename}`);

    expect(exists, `'${readablePath}/${filename}' must exists`).toBeTrue();
  }
  /**
   * xyz
   */


  fileIsMatrix(filename, {
    path,
    readablePath,
    type
  }) {
    const content = _fss.default.readFile(`${path}/${filename}`, 'utf8');

    const matrixContent = _fss.default.readFile(matrix(filename, type), 'utf8');

    expect(content, `'${readablePath}/${filename}' must be identical to matrix`).toBe(matrixContent);
  }
  /**
   * xyz
   */


  fileContainsMatrix(filename, {
    path,
    readablePath,
    type
  }) {
    const entries = extractEntries(`${path}/${filename}`);
    const matrixEntries = extractEntries(matrix(filename, type));
    expect(entries, `'${readablePath}/${filename}' must contain matrix`).toIncludeAllMembers(matrixEntries);
  }
  /**
   * xyz
   */


  validate({
    root,
    ignore = [],
    type
  }) {
    describe(`Validate arborescence`, () => {
      const selfTest = true;

      const currentRoot = _fss.default.realpath(root);

      const options = {
        type,
        path: currentRoot,
        readablePath: currentRoot.startsWith(_paths.default.project.root) ? currentRoot.substring(_paths.default.project.root.length + 1) : currentRoot
      };

      if (!ignore.includes(EDITORCONFIG)) {
        test(`Ensure '.editorconfig' is valid`, () => {
          this.fileExists('.editorconfig', options);
        });
      }

      if (!ignore.includes(ESLINTRC)) {
        test(`Ensure '.eslintrc.yaml' is valid`, () => {
          this.fileExists('.eslintrc.yaml', options);
          this.fileContainsMatrix('.eslintrc.yaml', options);
        });
      }

      if (!ignore.includes(GITIGNORE)) {
        test(`Ensure '.gitignore' is valid`, () => {
          this.fileExists('.gitignore', options);
          this.fileContainsMatrix('.gitignore', options);
        });
      }

      if (!ignore.includes(NPMIGNORE)) {
        test(`Ensure '.npmignore' is valid`, () => {
          this.fileExists('.npmignore', options);

          if (!selfTest) {
            this.fileContainsMatrix('.npmignore', options);
          }
        });
      }

      if (!ignore.includes(TRAVIS)) {
        test(`Ensure '.travis.yml' is valid`, () => {
          this.fileExists('.travis.yml', options);
          this.fileIsMatrix('.travis.yml', options);
        });
      }

      test(`Ensure 'license' is valid`, () => {
        this.fileExists('license', options);
        this.fileIsMatrix('license', options);
      });

      if (!ignore.includes(MANAGER)) {
        test(`Ensure 'manager.js' is valid`, () => {
          this.fileExists('manager.js', options);
        });
      }

      if (!ignore.includes(PACKAGE)) {
        test(`Ensure 'package.json' is valid`, () => {
          this.fileExists('package.json', options);
        });
      }

      test(`Ensure 'readme.md' is valid`, () => {
        this.fileExists('readme.md', options);
      });

      if (!ignore.includes(TEST)) {
        test(`Ensure 'test' is valid`, () => {
          this.fileExists('test', options);
        });
      }
    });
  }

}

var _default = new Arborescence();

exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;