// 没有使用 eslint-plugin-mocha 因为它的规则太严了
module.exports = {
	root: true,
	extends: [
		"./configs/core",
		"./configs/typescript",
	],
	env: {
		node: true,
	},
	rules: {
		"@kaciras/import-group-sort": "warn",
	},
	overrides: [
		{
			files: "tests/**/*.?(m)[jt]s",
			env: { mocha: true },
		},
	],
};
