/*
 * 这些扩展里已经添加了插件，无需再写 plugins: [...]
 */
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
		// React 17 开始使用新的 JSX 转换，无需在文件里导入 React 包
		// https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",
	},
};
