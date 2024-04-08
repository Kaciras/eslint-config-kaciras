import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import jsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";

/*
 * 该配置仅适用于 React 17+ 并使用 React Hooks 的项目。
 */
export default [
	reactRecommended,
	jsxRuntime,
	{
		name: "kaciras/react",
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			// 写太快可能没注意这个，加上该规则以便用 ESLint 批量改。
			"react/jsx-curly-brace-presence": [2, {
				props: "never",
				children: "never",
			}],

			// 都是动态页面的时代了，默认的 submit 基本用不到，还容易漏。
			"react/button-has-type": 2,
		},
	},
];
