//--------------------------------------------------------
//-- Tester - Tests - Unit - Tester
//--------------------------------------------------------
import { given, when, then } from "./Tester.gwt.js";

beforeEach(() => {
	given.emptyData();
	given.mockedProcessArgv();
	given.mockedFss();
	given.mockedTerminal();
	given.mockedProcessExit();
	given.tester();
});

afterEach(() => {
	then.restoreMocks();
});

describe('"single-package" repository type', () => {
	beforeEach(() => {
		given.existingGenericTests();
		given.repositoryType("single-package");
	});

	describe('"simple" package type', () => {
		beforeEach(() => {
			given.packageType("simple");
		});

		test('Can initialize for "all" scope', () => {
			given.scope("all");
			when.initializing();
			then.shouldHaveRunAllTests();
		});

		test('Can initialize for "unit" scope', () => {
			given.scope("unit");
			when.initializing();
			then.shouldHaveRunUnitTests();
		});

		test('Can initialize for "feature" scope', () => {
			given.scope("feature");
			when.initializing();
			then.shouldHaveRunFeatureTests();
		});

		test('Can initialize for "integration" scope', () => {
			given.scope("integration");
			when.initializing();
			then.shouldHaveRunIntegrationTests();
		});

		test('Can initialize for "endtoend" scope', () => {
			given.scope("endtoend");
			when.initializing();
			then.shouldHaveRunEndToEndTests();
		});

		test('Can initialize for "standards" scope', () => {
			given.scope("standards");
			when.initializing();
			then.shouldHaveRunStandardsTests();
		});

		test('Cannot initialize for "unknown" scope', () => {
			given.scope("unknown");
			when.initializing();
			then.shouldHaveThrown();
		});
	});

	describe('"ioc" package type', () => {
		beforeEach(() => {
			given.packageType("ioc");
		});

		test('Can initialize for "all" scope', () => {
			given.scope("all");
			when.initializing();
			then.shouldHaveRunStandardsTests();
			then.shouldNotHaveRunStandardsTestsThroughIoC();
			then.shouldHaveRunUnitTestsThroughIoC();
			then.shouldHaveRunFeatureTestsThroughIoC();
			then.shouldHaveRunIntegrationTestsThroughIoC();
			then.shouldHaveRunEndToEndTestsThroughIoC();
		});

		test('Can initialize for "unit" scope', () => {
			given.scope("unit");
			when.initializing();
			then.shouldNotHaveRunTests();
			then.shouldHaveRunUnitTestsThroughIoC();
		});

		test('Can initialize for "feature" scope', () => {
			given.scope("feature");
			when.initializing();
			then.shouldNotHaveRunTests();
			then.shouldHaveRunFeatureTestsThroughIoC();
		});

		test('Can initialize for "integration" scope', () => {
			given.scope("integration");
			when.initializing();
			then.shouldNotHaveRunTests();
			then.shouldHaveRunIntegrationTestsThroughIoC();
		});

		test('Can initialize for "endtoend" scope', () => {
			given.scope("endtoend");
			when.initializing();
			then.shouldNotHaveRunTests();
			then.shouldHaveRunEndToEndTestsThroughIoC();
		});

		test('Can initialize  for "standards" scope', () => {
			given.scope("standards");
			when.initializing();
			then.shouldHaveRunStandardsTests();
			then.shouldNotHaveRunStandardsTestsThroughIoC();
		});

		test('Cannot initialize for "unknown" scope', () => {
			given.scope("unknown");
			when.initializing();
			then.shouldHaveThrown();
		});
	});
});
