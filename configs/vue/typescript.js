import tseslint from "typescript-eslint";
import vuePreset from "./index.js";

/**
 * 对 Vue SFC 文件使用 TypeScript 规则，并强制其使用 <script lang="ts">。
 * 在与 @kaciras/typescript 一起使用时必须放在其后面。
 */
export default [...vuePreset, {
	name: "kaciras/vue-typescript",
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
