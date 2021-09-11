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
	rules: {
		// 属性等号加空格不好看，调整风格时可能会多出意外的空格，所以加上此规则。
		"react/jsx-equals-spacing": ["error", "never"],
	},
};
