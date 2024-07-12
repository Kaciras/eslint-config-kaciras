import tseslint from "typescript-eslint";

export default [...tseslint.configs.recommended, {
	name: "kaciras/typescript",
	rules: {
		// I need `any` for the flexible language.
		"@typescript-eslint/no-explicit-any": 0,

		// Allow @ts-expect-error without description.
		"@typescript-eslint/ban-ts-comment": [2, {
			"ts-expect-error": false,
		}],

		// Avoid edge cases, and allow move the row to reordering.
		"@typescript-eslint/comma-dangle": [2, "always-multiline"],

		// Maybe useful...
		"@typescript-eslint/no-unused-vars": [2, {
			ignoreRestSiblings: true,
			argsIgnorePattern: "^_+$",
			varsIgnorePattern: "^_+$",
		}],

		// Complex arrays are better off with a generic type.
		"@typescript-eslint/array-type": [2, {
			default: "array-simple",
		}],

		// 习惯加标点了，保持一致吧。
		"@typescript-eslint/member-delimiter-style": 2,
	},
}];
