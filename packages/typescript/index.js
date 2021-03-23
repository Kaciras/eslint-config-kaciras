module.exports = {
	plugins: ["@typescript-eslint"],

	overrides: [{
		files: ["*.ts?(x)"],
		extends: [
			"plugin:@typescript-eslint/recommended",
		],
		parser: "@typescript-eslint/parser",
		rules: {
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-explicit-any": "off",

			//
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/no-empty-function": "off",
		},
	}],
};
