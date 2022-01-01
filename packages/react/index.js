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
		// 都是动态页面的时代了，默认的 submit 基本用不到，还容易漏。
		"react/button-has-type": "error",
	},
};
