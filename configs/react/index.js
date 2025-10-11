import reactHooks from "eslint-plugin-react-hooks";
import reactPlugin from "eslint-plugin-react";

// Designed for projects that use React 17+ with Hooks.
export default [
	reactHooks.configs.flat["recommended-latest"],
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	{
		name: "kaciras/react",
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			// Let ESLint fix it for me.
			"react/jsx-curly-brace-presence": [2, {
				props: "never",
				children: "never",
			}],

			// If you forget this of a button inside a form,
			// click it will refresh the page unexpectedly.
			"react/button-has-type": 2,

			// Not intelligent enough.
			"react-hooks/static-components": 0,
		},
	},
];
