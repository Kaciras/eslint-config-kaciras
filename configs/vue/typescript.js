import tsEslint from "typescript-eslint";
import vuePreset from "./index.js";

/**
 * Forcing Vue SFC uses TypeScript in <script> blocks.
 *
 * It's a replacement of the index module, do not add both.
 */
export default [...vuePreset, {
	name: "kaciras/vue-typescript",
	files: ["**/*.vue"],
	languageOptions: {
		parserOptions: {
			parser: tsEslint.parser,
		},
	},
	rules: {
		"vue/block-lang": [2, { script: { lang: "ts" } }],
	},
}];
