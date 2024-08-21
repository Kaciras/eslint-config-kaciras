import eslintPlugin from "eslint-plugin-eslint-plugin";
import core from "./configs/core/index.js";
import typescript from "./configs/typescript/index.js";

// Not use eslint-plugin-mocha because its rules are too strict.
export default [...core, ...typescript, {
	rules: {
		"kaciras/import-specifier-order": "warn",
	},
}, {
	files: ["plugin/*.js"],
	...eslintPlugin.configs["flat/recommended"],
}];
