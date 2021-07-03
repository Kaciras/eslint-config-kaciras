// 没有使用 eslint-plugin-mocha 因为它的规则太严了
module.exports = {
	root: true,
	extends: [
		"plugin:eslint-plugin/recommended",
		"./packages/core",
		"./packages/typescript",
	],
	env: {
		node: true,
	},
	overrides: [
		{
			files: "tests/**/*.?(m)[jt]s",
			env: { mocha: true },
		},
	],
};
