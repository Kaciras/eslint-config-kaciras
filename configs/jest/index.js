import jest from "eslint-plugin-jest";

/**
 * 因为无法在 eslint 的配置里获取 jest 的配置，所以没法自动配置 files。
 * 建议手动设置 files 属性，仅对测试文件生效：
 *
 * @example
 * import jest from "@kaciras/eslint-config-jest";
 * import { testMatch } from "./jest.config.js";
 *
 * export default [{ ...jest, files: testMatch }]
 */
export default [
	jest.configs["flat/recommended"],
	jest.configs["flat/style"],
	{
		name: "kaciras/jest",
		rules: {
			// 生命周期钩子当然要写在最前面啊。
			"jest/prefer-hooks-on-top": 2,

			// 无法识别第三方库的断言，添加 assertFunctionNames 也很麻烦。
			"jest/expect-expect": 0,

			// 有些库还在用回调式的 API，强行转异步不好看。
			"jest/no-done-callback": 0,

			// Prefer sugar functions.
			"jest/prefer-mock-promise-shorthand": 2,
		},
	}
];
