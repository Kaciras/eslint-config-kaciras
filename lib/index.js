module.exports = {
	env: {
		es2021: true,
	},
	extends: [
		"eslint:recommended",
	],
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
	}
};
