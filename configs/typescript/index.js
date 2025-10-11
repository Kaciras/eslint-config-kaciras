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

		"stylistic/member-delimiter-style": 2,
	},
}];
