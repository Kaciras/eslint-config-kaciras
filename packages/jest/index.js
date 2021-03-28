/*
 * 我想用 overrides ESLint 似乎没有提供在配置文件里获取 cwd 参数的方法。
 * files: require(".jest.config").testMatch,
 *
 * env.jest 已经在插件中设置了，这里无需再写。
 */
module.exports = {
	extends: [
		"plugin:jest/style",
		"plugin:jest/recommended",
	],
	rules: {
		// 无法识别第三方库的断言，就算添加 assertFunctionNames 也很麻烦。
		"jest/expect-expect": "off",

		// 有些库还在用回调式的 API，强行转异步也不好看。
		"jest/no-done-callback": "off",
	},
};
