import tseslint from "typescript-eslint";

export default [...tseslint.configs.recommended, {
	name: "kaciras/typescript",
	rules: {
		// I need `any` for the flexible language.
		"@typescript-eslint/no-explicit-any": 0,

		// Type-test needs `@ts-expect-error`.
		"@typescript-eslint/ban-ts-comment": 0,

		// 多行总是加上末尾的逗号，一来整齐些，二是调整顺序更方便。
		// TS 多了一些情况比如枚举、泛型，要单独配置下。
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

		// 不要把 non-null 的感叹号跟等号连用。
		"@typescript-eslint/no-confusing-non-null-assertion": 2,
	},
}];
