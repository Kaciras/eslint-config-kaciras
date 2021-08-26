module.exports = {
	extends: [
		// 里面已经设置了 parser: "vue-eslint-parser"
		"plugin:vue/vue3-essential",
	],
	rules: {
		// 没有 emits 或是 onXXX props 的话事件会绑到元素上
		"vue/require-explicit-emits": ["error", { allowProps: true }],

		// 检查下是否有忘记删掉的无效 <template>
		"vue/no-lone-template": ["error", { ignoreAccessible: true }],
	},
};
