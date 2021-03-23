module.exports = {
	plugins: ["@typescript-eslint"],

	overrides: [{
		files: ["*.ts?(x)"],
		extends: [
			"plugin:@typescript-eslint/recommended",
		],
		parser: "@typescript-eslint/parser",
		rules: {
			// 不让用感叹号是不对的，总有些情况必须这样做。
			"@typescript-eslint/no-non-null-assertion": "off",

			// 跟上面一条理由一样。
			"@typescript-eslint/no-explicit-any": "off",

			// 不需要，而且显示定义会导致一行很长不好看。
			"@typescript-eslint/explicit-module-boundary-types": "off",

			// TS 并非完美无缺，总有用到 @ts-ignore 的时候。
			"@typescript-eslint/ban-ts-comment": "off",

			// 空函数也没有用我自己会检查的，不用提醒。
			"@typescript-eslint/no-empty-function": "off",
		},
	}],
};
