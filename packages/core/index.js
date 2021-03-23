module.exports = {
	extends: [
		"eslint:recommended",
	],
	env: {
		es2021: true,
	},
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	rules: {
		"quotes": ["error", "double", { avoidEscape: true }],
		"indent": ["error", "tab", { SwitchCase: 1 }],
		"linebreak-style": ["error", "unix"],
		"semi": ["error", "always"],
		"comma-dangle": ["error", "always-multiline"],
	},
};
