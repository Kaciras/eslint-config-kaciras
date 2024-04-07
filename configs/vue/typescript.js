// const tsPreset = require.resolve("@kaciras/eslint-config-typescript/base");
const vuePreset = require("./index.js");
const tseslint = require("typescript-eslint");

/*
 * 对 Vue SFC 文件使用 TypeScript 规则，并强制其使用 <script lang="ts">。
 * 与 @kaciras/typescript 一起使用时必须放在其后面。
 */
module.exports = [...vuePreset, {
	files: ["**/*.vue"],
	languageOptions: {
		parserOptions: {
			parser: tseslint.parser,
		},
	},
	rules: {
		"vue/block-lang": [2, { script: { lang: "ts" } }],
	},
}];
