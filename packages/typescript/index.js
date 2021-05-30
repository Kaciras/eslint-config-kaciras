/*
 * @typescript-eslint/eslint-plugin/dist/configs/base.js 里已经添加了 parser 和 plugin，这里无需再写。
 *
 * TS 的规则和 JS 有冲突，故需要将 TS 的规则放在 overrides 里，详情见：
 * https://github.com/typescript-eslint/typescript-eslint/issues/1928
 */
module.exports = {
	overrides: [{
		files: ["*.ts?(x)"],
		extends: [
			"plugin:@typescript-eslint/recommended",
		],
		rules: {
			// 不让用感叹号是不对的，总有些情况必须这样做。
			"@typescript-eslint/no-non-null-assertion": "off",

			// 跟上面一条理由一样。
			"@typescript-eslint/no-explicit-any": "off",

			// 该怎么导入我是很清楚的，而且 CJS 模块只能用 require。
			"@typescript-eslint/no-var-requires": "off",

			// 多余的参数不应视为未使用。
			"@typescript-eslint/no-unused-vars": ["error", {
				args: "none",
				ignoreRestSiblings: true,
			}],

			// 复杂类型的数组还是用泛型好些，简单的用方括号。
			"@typescript-eslint/array-type": ["error", {
				default: "array-simple",
			}],

			// 习惯加标点了，保持一致吧。
			"@typescript-eslint/member-delimiter-style": "error",

			// 不需要，而且会导致一行很长。
			"@typescript-eslint/explicit-module-boundary-types": "off",

			// TS 并非完美无缺，总有用到 @ts-ignore 的时候。
			"@typescript-eslint/ban-ts-comment": "off",

			// 空函数我自己会检查的，不需要提醒。
			"@typescript-eslint/no-empty-function": "off",
		},
	}],
};
