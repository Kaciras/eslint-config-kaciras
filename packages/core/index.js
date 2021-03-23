module.exports = {
	extends: [
		"eslint:recommended",
	],
	env: {
		es2021: true,
	},
	parserOptions: {
		sourceType: "module",
	},
	rules: {
		// 很多语言但括号用于 char，这里保持一致使用双括号。
		"quotes": ["error", "double", { avoidEscape: true }],

		// 我用 TAB 缩进，空格都是异端！
		"indent": ["error", "tab", { SwitchCase: 1 }],

		// 换行用俩字符确实多余，统一使用 \n
		"linebreak-style": ["error", "unix"],

		// 函数名和括号见不加空格，关键字与括号间加。
		"space-before-function-paren": ["error", {
			anonymous: "never",
			named: "never",
			asyncArrow: "always",
		}],

		// 永远使用三等号，避免一些无聊的问题。
		"eqeqeq": "error",

		// JS 的分号是有坑的，不知道为什么默认不加。
		"semi": ["error", "always"],

		// 末尾逗号保持跟前面的一致，调整顺序或删除都不会忘了逗号。
		"comma-dangle": ["error", "always-multiline"],
	},
};
