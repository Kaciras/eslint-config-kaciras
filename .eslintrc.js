// 没有使用 eslint-plugin-mocha 因为它的规则太严了
module.exports = {
	root: true,
	extends: [
		"./packages/core/index.js",
		"./packages/typescript/index.js",
	],
	env: {
		node: true,
	},
	overrides: [
		{
			files: "tests/**/*.ts",
			env: { mocha: true },
		},
	],
};
