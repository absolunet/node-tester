//--------------------------------------------------------
//-- Prettier helper
//--------------------------------------------------------
import path from "path";
import fsp from "@absolunet/fsp";
import { pass, fail, skip } from "create-jest-runner";
import findUp from "find-up";
import prettier from "prettier";
import runner from "./runner/index.js";

/**
 * Prettier helper.
 *
 * @hideconstructor
 */
class PrettierHelper {
	/**
	 * Parse the package.json.
	 *
	 * @param {string} testPath - File to lint.
	 * @returns {TestResult} Jest {@link https://github.com/facebook/jest/blob/4d3c1a187bd429fd8611f6b0f19e4aa486fa2a85/packages/jest-test-result/src/types.ts#L103-L135 TestResult} object.
	 */
	async run(testPath) {
		const testResult = runner.initTestResult({ testPath, title: "Prettier" });

		const ignorePath = await findUp(".prettierignore", { cwd: path.dirname(testPath) });
		const { ignored } = await prettier.getFileInfo(testPath, { ignorePath });

		if (ignored) {
			return skip(testResult());
		}

		const config = await prettier.resolveConfig(testPath);
		config.filepath = testPath;

		const content = await fsp.readFile(testPath, "utf8");

		const valid = await prettier.check(content, config);

		if (!valid) {
			return fail(testResult(runner.formatError("File has not been formatted with Prettier.")));
		}

		return pass(testResult());
	}
}

export default new PrettierHelper();
