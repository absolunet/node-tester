//--------------------------------------------------------
//-- Lint JSON runner - Run
//--------------------------------------------------------
import { createRequire } from "module";
import eslint from "../../helpers/eslint.js";

const require = createRequire(__filename);

const JSON_CONFIG = require.resolve("@absolunet/eslint-config-json");

const lintJSONRunner = ({ testPath }) => {
	return eslint.run(testPath, {
		baseConfig: { extends: JSON_CONFIG },
		resolvePluginsRelativeTo: JSON_CONFIG,
		extensions: [".json"],
		useEslintrc: false,
	});
};

export default lintJSONRunner;
