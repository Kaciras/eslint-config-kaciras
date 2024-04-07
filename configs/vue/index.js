import pluginVue from "eslint-plugin-vue";

// 里面已经设置了 parser: "vue-eslint-parser"
export default [...pluginVue.configs["flat/essential"], {
	rules: {
		// 没有 emits 或是 onXXX props 的话事件会绑到元素上，应当避免。
		"vue/require-explicit-emits": [2, { allowProps: true }],

		// I use double quote in JS, so single for template.
		"vue/html-quotes": [2, "single", { avoidEscape: true }],

		// 驼峰更好，跟 JSX 一致，同时也和 Custom Element 区分开。
		"vue/component-name-in-template-casing": [2, "PascalCase"],
	},
}];
