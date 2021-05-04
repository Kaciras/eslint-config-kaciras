module.exports = {
	extends: [
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		// React 17 开始使用新的 JSX 转换，无需再导入 React
		// https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",

		// 属性等号加空格不好看，调整风格时可能会多出意外的空格，所以加上此规则。
		"react/jsx-equals-spacing": ["error", "never"],
	},
};
