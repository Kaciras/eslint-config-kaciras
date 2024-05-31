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
			// 生命周期钩子当然要写在最前面啊。
			"jest/prefer-hooks-on-top": 2,

			// Cannot recognize assertions from third-party libraries.
			"jest/expect-expect": 0,

			// 有些库还在用回调式的 API，强行转异步不好看。
			"jest/no-done-callback": 0,

			// Prefer sugar functions.
			"jest/prefer-mock-promise-shorthand": 2,
		},
	}
];
