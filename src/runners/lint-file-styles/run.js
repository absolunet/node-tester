//--------------------------------------------------------
//-- Lint file styles - Run
//--------------------------------------------------------
import { pass, fail, skip } from "create-jest-runner";
import eclint from "eclint";
import reporter from "gulp-reporter";
import vfs from "vinyl-fs";
import runner from "../../helpers/runner/index.js";

const lintFileStylesRunner = ({ testPath }) => {
	const testResult = runner.initTestResult({ testPath, title: "EditorConfig" });

	// Bad patch
	if (testPath.endsWith(".md")) {
		return skip(testResult());
	}

	return new Promise((resolve, reject) => {
		vfs
			.src(testPath)
			.pipe(eclint.check())
			.pipe(
				reporter({
					blame: false,
					fail: false,
					output: (output) => {
						reject(output);
					},
				})
			)
			.on("finish", () => {
				resolve();
			});
	})
		.then(() => {
			return pass(testResult());
		})
		.catch((error) => {
			const rawError = error.split("\n");
			rawError.shift();

			return fail(testResult(runner.formatError(rawError.join("\n"))));
		});
};

export default lintFileStylesRunner;
