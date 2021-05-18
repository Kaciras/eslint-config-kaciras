/*
 * 建议将此扩展写在 overrides 里，仅对测试文件使用。
 * {
 *     overrides: [{
 *         files: require("./jest.config").testMatch,
 *         extends: ["@kaciras/jest"],
 *     }],
 * }
 * 我想用 overrides ESLint 似乎没有提供在配置文件里获取 cwd 参数的方法。
 */
module.exports = {
	// env.jest 已经在插件中设置了，这里无需再写。
	extends: [
		"plugin:jest/style",
		"plugin:jest/recommended",
	],
	rules: {
		// 生命周期钩子当然要写在最前面啊。
		"jest/prefer-hooks-on-top": "error",

		// 无法识别第三方库的断言，添加 assertFunctionNames 也很麻烦。
		"jest/expect-expect": "off",

		// 有些库还在用回调式的 API，强行转异步不好看。
		"jest/no-done-callback": "off",
	},
};
