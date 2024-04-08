import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import jsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";

// Designed for projects that use React 17+ with Hooks.
export default [reactRecommended, jsxRuntime, {
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

		/*
		 * If you forget this of a button inside a form,
		 * click it will refresh the page unexpectedly.
		 */
		"react/button-has-type": 2,
	},
}];
