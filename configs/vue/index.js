import pluginVue from "eslint-plugin-vue";

/**
 * Used for Vue SFC without typescript, already includes `files: ["**\/*.vue"]`
 */
export default [...pluginVue.configs["flat/essential"], {
	name: "kaciras/vue",
	rules: {
		// Events are bound to the element if there are no emits or on* props.
		"vue/require-explicit-emits": [2, { allowProps: true }],

		// I used double quote in JS, so single for template.
		"vue/html-quotes": [2, "single", { avoidEscape: true }],

		// Consistent with JSX, and different from custom elements.
		"vue/component-name-in-template-casing": [2, "PascalCase"],
	},
}];
