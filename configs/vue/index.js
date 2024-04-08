import pluginVue from "eslint-plugin-vue";

/**
 * Used for Vue SFC without typescript, already includes `files: ["**\/*.vue"]`
 */
export default [...pluginVue.configs["flat/essential"], {
	name: "kaciras/vue",
	rules: {
		// 没有 emits 或是 onXXX props 的话事件会绑到元素上，应当避免。
		"vue/require-explicit-emits": [2, { allowProps: true }],

		// I used double quote in JS, so single for template.
		"vue/html-quotes": [2, "single", { avoidEscape: true }],

		// Consistent with JSX, and different from custom elements.
		"vue/component-name-in-template-casing": [2, "PascalCase"],
	},
}];
