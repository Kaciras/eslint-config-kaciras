module.exports = {
	extends: [
		"eslint:recommended",
	],
	env: {
		// 这个包含了 parserOptions.ecmaVersion: 12
		es2021: true,
	},
	parserOptions: {
		sourceType: "module",
	},
	rules: {
		// 很多语言单括号用于 char，这里保持一致使用双括号。
		"quotes": ["error", "double", { avoidEscape: true }],

		// 我就是要用 TAB 缩进，空格都是异端！
		"indent": ["error", "tab", { SwitchCase: 1 }],

		// 换行用俩字符确实多余，统一使用 \n
		"linebreak-style": ["error", "unix"],

		// 函数名和括号见不加空格，关键字与括号间加。
		"space-before-function-paren": ["error", {
			anonymous: "always",
			named: "never",
			asyncArrow: "always",
		}],

		// 我应该不会这么写吧，不过还是加上以免意外。
		"no-array-constructor": "error",

		// 永远使用三等号，避免一些无聊的问题。
		// 有时候其它语言写多了，回来会忘，所以启用这个规则。
		"eqeqeq": "error",

		// 一些永远不要使用的特性。
		"no-sequences": "error",
		"no-throw-literal": "error",
		"no-label-var": "error",

		// JS 的分号是有坑的，不知道为什么默认不启用这规则。
		"semi": ["error", "always"],

		// 多行元素末尾一律加逗号，便于删除和调整顺序。
		"comma-dangle": ["error", "always-multiline"],
	},
};
