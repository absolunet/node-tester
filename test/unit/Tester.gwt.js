//--------------------------------------------------------
//-- Tester - Tests - Unit - Tester - GWT
//--------------------------------------------------------
import { createRequire } from "module";

const given = {};
const when = {};
const then = {};

const { argv: processArgv } = process;

let tester;
let options;
let exception;
let fakeFiles;
let mockedExit;

//-- Mocks
//--------------------------------------------------------

const mockedFss = {
	realpath: jest.fn((relativePath) => {
		return `path/to/root${relativePath === "." ? "" : `/${relativePath}`}`;
	}),
	existsCase: jest.fn(() => {
		return true;
	}),
	readFile: jest.fn((fileName) => {
		return fakeFiles[fileName] || "";
	}),
};

const mockedTerminal = {
	process: {
		run: jest.fn(),
	},
};

//-- Given
//--------------------------------------------------------

given.tester = () => {
	const require = createRequire(__filename);
	const Tester = require("../../dist/node/AbsolunetTester.js");
	tester = new Tester.default();
};

given.emptyData = () => {
	given.emptyOptions();
	given.emptyException();
};

given.mockedProcessExit = () => {
	mockedExit = jest.spyOn(process, "exit").mockImplementation(() => {
		/**/
	});
};

given.mockedProcessArgv = () => {
	process.argv = ["/path/to/node", "test"];
};

given.mockedFss = () => {
	jest.mock("@absolunet/fss", () => {
		return mockedFss;
	});
	fakeFiles = {};
};

given.mockedTerminal = () => {
	jest.mock("@absolunet/terminal", () => {
		return { terminal: mockedTerminal };
	});
};

given.existingGenericTests = () => {
	fakeFiles["path/to/root/test/generic/index.test.js"] = `
		import { tester } from '@absolunet/tester';

		tester.genericRepositoryTests();
	`;
};

given.scope = (scope) => {
	process.argv.push(`--scope=${scope}`);
};

given.emptyOptions = () => {
	options = undefined;
};

given.emptyException = () => {
	exception = undefined;
};

given.repositoryType = (type) => {
	options = options || {};
	options.repositoryType = type;
};

given.packageType = (type) => {
	options = options || {};
	options.packageType = type;
};

//-- When
//--------------------------------------------------------

when.initializing = () => {
	try {
		tester.init(options);
	} catch (error) {
		exception = error;
	}
};

//-- Then
//--------------------------------------------------------

then.restoreMocks = () => {
	process.argv = processArgv;
	jest.clearAllMocks();
	mockedExit.mockRestore();
};

then.shouldNotHaveThrown = () => {
	expect(exception).toBeFalsy();
};

then.shouldHaveThrown = () => {
	expect(exception).toBeTruthy();
};

then.shouldHaveExitWithCode = (code) => {
	expect(mockedExit).toHaveBeenCalledWith(code);
};

then.shouldHaveRunThroughTester = (scope) => {
	then.shouldNotHaveThrown();
	expect(mockedTerminal.process.run).toHaveBeenCalled();
	expect(mockedTerminal.process.run.mock.calls[0][1].environment.__ABSOLUNET_TESTER_JEST_CONFIG__).toMatch(
		new RegExp(`"scope":"${scope}"`, "u")
	);
};

then.shouldHaveRunThroughIoC = (scope) => {
	then.shouldNotHaveThrown();
	expect(mockedTerminal.process.run).toHaveBeenCalled();
	expect(mockedTerminal.process.run.mock.calls).toContainEqual([
		`node ioc test --type=${scope}`,
		{ environment: { NODE_ENV: "test" } },
	]);
};

then.shouldNotHaveRunTests = () => {
	then.shouldNotHaveThrown();
	const parameters = mockedTerminal.process.run.mock.calls[0][1] || {};
	const environment = parameters.environment || {};
	expect(environment).not.toContainKey("__ABSOLUNET_TESTER_JEST_CONFIG__");
};

then.shouldHaveRunAllTests = () => {
	then.shouldHaveRunThroughTester("all");
};

then.shouldHaveRunStandardsTests = () => {
	then.shouldHaveRunThroughTester("standards");
};

then.shouldHaveRunUnitTests = () => {
	then.shouldHaveRunThroughTester("unit");
};

then.shouldHaveRunFeatureTests = () => {
	then.shouldHaveRunThroughTester("feature");
};

then.shouldHaveRunIntegrationTests = () => {
	then.shouldHaveRunThroughTester("integration");
};

then.shouldHaveRunEndToEndTests = () => {
	then.shouldHaveRunThroughTester("endtoend");
};

then.shouldHaveRunUnitTestsThroughIoC = () => {
	then.shouldHaveRunThroughIoC("unit");
};

then.shouldHaveRunFeatureTestsThroughIoC = () => {
	then.shouldHaveRunThroughIoC("feature");
};

then.shouldHaveRunIntegrationTestsThroughIoC = () => {
	then.shouldHaveRunThroughIoC("integration");
};

then.shouldHaveRunEndToEndTestsThroughIoC = () => {
	then.shouldHaveRunThroughIoC("endtoend");
};

then.shouldNotHaveRunStandardsTestsThroughIoC = () => {
	then.shouldNotHaveThrown();
	expect(mockedTerminal.process.run.mock.calls).not.toContainEqual([`node ioc test --scope=standards`]);
};

export { given, when, then };
