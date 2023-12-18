/*
 * 包含了 TypeScript 相关的规则，注意这些规则会跟 JS 的冲突，最好限制范围。
 *
 * @typescript-eslint/eslint-plugin/dist/configs/base.js 里已经添加了 parser 和 plugin。
 *
 * TS 的规则和 JS 有冲突，故需要将 TS 的规则放在 overrides 里，详情见：
 * https://github.com/typescript-eslint/typescript-eslint/issues/1928
 */
module.exports = {
	extends: [
		"plugin:@typescript-eslint/recommended",
	],
	rules: {
		// 不让用感叹号和 any 是不对的，总有些情况必须这样做。
		"@typescript-eslint/no-explicit-any": 0,

		// TS 并非完美无缺，总有用到 @ts-ignore 的时候。
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
};
