import jest from "eslint-plugin-jest";

/**
 * It is recommended to manually set the files attribute to take effect only for test files.
 *
 * @example
 * import jest from "@kaciras/eslint-config-jest";
 * import jc from "./jest.config.js";
 *
 * export default [
 *     ...jest.map(config => ({	...config, files: jc.testMatch }))
 * ]
 */
export default [
	jest.configs["flat/recommended"],
	jest.configs["flat/style"],
	{
		name: "kaciras/jest",
		rules: {
			// Cannot recognize assertions from third-party libraries.
			"jest/expect-expect": 0,

			// Some libraries still use callback-style APIs,
			// and converting them to asynchronous isn't elegant.
			"jest/no-done-callback": 0,

			// Prefer sugar functions.
			"jest/prefer-mock-promise-shorthand": 2,

			// Lifecycle hooks interspersed in cases makes it difficult to find。
			"jest/prefer-hooks-on-top": 2,
		},
	},
];
