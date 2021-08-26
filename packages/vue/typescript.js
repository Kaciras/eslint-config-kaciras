const tsPreset = require.resolve("@kaciras/eslint-config-typescript/base");
const vuePreset = require.resolve("./index");

/*
 * 对 Vue SFC 文件使用 TypeScript 规则，并强制其使用 <script lang="ts">。
 */
module.exports = {
	extends: [vuePreset],
	parserOptions: {
		parser: "@typescript-eslint/parser",
	},
	overrides: [{
		files: ["*.vue"],
		extends: [tsPreset],
		parser: "vue-eslint-parser",
	}],
	rules: {
		"vue/block-lang": ["error", { script: { lang: "ts" } }],
	},
};
