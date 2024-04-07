const core = require("./configs/core/index.js");
const typescript = require("./configs/typescript/index.js");

// 没有使用 eslint-plugin-mocha 因为它的规则太严了
module.exports = [
	...core,
	...typescript,
	{
		// files: ["**/*.?(m)[jt]s"],
		// env: {
		// 	node: true,
		// },
		rules: {
			"kaciras/import-group-sort": "warn",
		},
	},
	{
		files: ["tests/**/*.?(m)[jt]s"],
		// env: { mocha: true },
	},
];
