import jest from "eslint-plugin-jest";

/*
 * 因为无法在 eslint 的配置里获取 jest 的配置，所以没法像 ts 那样直接用。
 * 建议将此扩展写在 overrides 里，仅对测试文件生效：
 * {
 *     overrides: [{
 *         files: require("./jest.config").testMatch,
 *         extends: ["@kaciras/jest"],
 *     }],
 * }
 *
 * 我想用 overrides ESLint 似乎没有提供在配置文件里获取 cwd 参数的方法。
 */
export default {
	...jest.configs["flat/recommended"],
	rules: {
		...jest.configs["flat/recommended"].rules,
		...jest.configs["flat/style"].rules,

		// 生命周期钩子当然要写在最前面啊。
		"jest/prefer-hooks-on-top": 2,

		// 无法识别第三方库的断言，添加 assertFunctionNames 也很麻烦。
		"jest/expect-expect": 0,

		// 有些库还在用回调式的 API，强行转异步不好看。
		"jest/no-done-callback": 0,

		// Prefer sugar functions.
		"jest/prefer-mock-promise-shorthand": 2,
	},
};
