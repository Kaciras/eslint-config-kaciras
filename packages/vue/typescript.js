const tsPreset = require.resolve("@kaciras/eslint-config-typescript/base");
const vuePreset = require.resolve("./index.js");

/*
 * 对 Vue SFC 文件使用 TypeScript 规则，并强制其使用 <script lang="ts">。
 * 与 @kaciras/typescript 一起使用时必须放在其后面。
 */
module.exports = {
	extends: [vuePreset],
	parserOptions: {
		parser: "@typescript-eslint/parser",
	},
	overrides: [{
		files: ["*.vue"],
		env: {
			"vue/setup-compiler-macros": true,
		},
		extends: [tsPreset],
		parser: "vue-eslint-parser",
	}],
	rules: {
		"vue/block-lang": ["error", { script: { lang: "ts" } }],
	},
};
