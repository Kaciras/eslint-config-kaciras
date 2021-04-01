import assert from "assert";
import { ESLint, Linter } from "eslint";

type ResolvedConfig = Required<Linter.Config>;

/**
 * 计算应用于指定文件的规则，展开 extends 和 overrides 属性。
 *
 * @param filename 文件名
 * @param config 规则
 */
function getConfig(filename: string, config: Linter.Config) {
	const eslint = new ESLint({
		useEslintrc: false,
		overrideConfig: config,
	});
	return eslint.calculateConfigForFile(filename) as Promise<ResolvedConfig>;
}

/**
 * 处理规则对象，统一返回数组形式，等级统一为字符串。
 *
 * @param rule 原始规则
 * @return 标准化后的规则
 */
function normalize(rule: Linter.RuleEntry) {
	if (!Array.isArray(rule)) {
		rule = [rule];
	}
	switch (rule[0]) {
		case 0:
			rule[0] = "off";
			break;
		case 1:
			rule[0] = "warn";
			break;
		case 2:
			rule[0] = "error";
			break;
	}
	return rule as Linter.RuleLevelAndOptions;
}

const packages = [
	{
		name: "core",
		plugins: [],
	},
	{
		name: "react",
		plugins: ["react", "react-hooks"],
	},
	{
		name: "jest",
		plugins: ["jest"],
	},
	{
		name: "typescript",
		plugins: ["@typescript-eslint"],
	},
];

// 没有使用 describe 包装测试因为 WebStorm 不识别。
packages.forEach(({ name, plugins }) => {

	/**
	 * 验证扩展已经添加了相关的插件，无需写 plugins: [...]。
	 */
	it("should add plugins from " + name, async () => {
		const config = await getConfig("foobar.tsx", {
			extends: "./packages/" + name,
		});

		assert.strictEqual(config.plugins.length, plugins.length);
		config.plugins.forEach(p => assert(plugins.includes(p)));
	});

	/**
	 * 检测是否存在跟 extends 里重复的规则。
	 */
	it("should deduplicate with extends - " + name, async () => {
		const module = require("../packages/" + name) as Linter.Config;

		const { rules } = await getConfig("foobar.tsx", {
			extends: module.extends,
		});

		for (const [k, v] of Object.entries(module.rules ?? {})) {
			const fromExt = rules[k];
			if (!fromExt) {
				continue;
			}
			const [level, ...options] = normalize(v!);
			const [baseLevel, ...baseOptions] = normalize(fromExt);

			if (level !== baseLevel) {
				continue;
			}
			assert.notDeepStrictEqual(baseOptions, options, k);
		}
	});
});

/**
 * 测试 typescript 包是否会和 JS 冲突，@typescript-eslint/* 规则不应用于 JS 文件。
 */
it("should avoid conflict with typescript", async () => {
	const code = "const unused = 0";
	const config = await getConfig("foobar.js", {
		env: {
			es2021: true,
		},
		extends: ["./packages/typescript"],
	});

	const linter = new Linter();
	const msg = linter.verify(code, config, "foobar.js");
	assert.strictEqual(msg.length, 0);
});
