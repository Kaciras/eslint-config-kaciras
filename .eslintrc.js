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
			files: ["tests/**/*.js"],
			env: { mocha: true },
		},
	],
};
