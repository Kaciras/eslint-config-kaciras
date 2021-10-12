module.exports = {
	extends: [
		// 里面已经设置了 parser: "vue-eslint-parser"
		"plugin:vue/vue3-essential",
	],
	rules: {
		// 没有 emits 或是 onXXX props 的话事件会绑到元素上，应当避免。
		"vue/require-explicit-emits": ["error", { allowProps: true }],
	},
};
