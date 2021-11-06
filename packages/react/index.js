/*
 * 该配置仅适用于 React 17+ 并使用 React Hooks 的项目。
 */
module.exports = {
	extends: [
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
	],
	settings: {
		react: {
			version: "detect",
		},
	},
};
