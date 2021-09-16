//--------------------------------------------------------
//-- Lint SCSS runner - Run
//--------------------------------------------------------
import { pass, fail, skip } from "create-jest-runner";
import stylelint from "stylelint";
import runner from "../../helpers/runner/index.js";

const lintSCSSRunner = ({ testPath }) => {
	const testResult = runner.initTestResult({ testPath, title: "stylelint" });

	return stylelint
		.lint({
			files: testPath,
			syntax: "scss",
			formatter: "string",
			allowEmptyInput: true,
		})
		.then((data) => {
			const [results] = data.results;

			if (results === undefined) {
				return skip(testResult());
			}

			if (results.warnings.length > 0 || results.deprecations.length > 0 || results.invalidOptionWarnings.length > 0) {
				const rawOutput = data.output.split("\n");
				rawOutput.splice(0, 2);

				return fail(testResult(rawOutput.join("\n")));
			}

			return pass(testResult());
		})
		.catch((error) => {
			return fail(testResult(runner.formatError(`${error.stack}\n`)));
		});
};

export default lintSCSSRunner;
