import tseslint from "typescript-eslint";

export default [...tseslint.configs.recommended, {
	name: "kaciras/typescript",
	rules: {
		// I need `any` for the flexible language.
		"@typescript-eslint/no-explicit-any": 0,

		// Type-test needs `@ts-expect-error`.
		"@typescript-eslint/ban-ts-comment": 0,

		// Avoid edge cases, and allow move the row to reordering.
		"@typescript-eslint/comma-dangle": [2, "always-multiline"],

		// 没有用到的参数也不要省略，保持签名的一致性。
		"@typescript-eslint/no-unused-vars": [2, {
			args: "none",
			ignoreRestSiblings: true,
		}],

		// 复杂类型的数组还是用泛型好些，简单的用方括号。
		"@typescript-eslint/array-type": [2, {
			default: "array-simple",
		}],

		// 习惯加标点了，保持一致吧。
		"@typescript-eslint/member-delimiter-style": 2,
	},
}];
