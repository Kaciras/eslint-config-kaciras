import assert from "assert";
import { ESLint } from "eslint";

/**
 * 计算应用于指定文件的规则，展开 extends 和 overrides 属性。
 *
 * @param filename 文件名
 * @param config 规则
 */
export async function getConfig(filename, config) {
	const eslint = new ESLint({
		overrideConfig: config,
		overrideConfigFile: true,
	});
	return eslint.calculateConfigForFile(filename);
}

/**
 * 处理规则对象，统一返回数组形式，等级统一为字符串。
 *
 * @param rule 原始规则
 * @return 标准化后的规则
 */
function normalize(rule) {
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
	return rule;
}

const packages = [
	{
		name: "../configs/core/index.js",
		plugins: ["kaciras", "stylistic"],
	},
	{
		name: "../configs/react/index.js",
		plugins: ["react"],
	},
	{
		name: "../configs/jest/index.js",
		plugins: ["jest"],
	},
	{
		name: "../configs/vue/index.js",
		plugins: ["vue"],
	},
	{
		name: "../configs/vue/typescript.js",
		plugins: ["vue"],
	},
	{
		name: "../configs/typescript/index.js",
		plugins: ["@typescript-eslint"],
	},
];

// 没有使用 describe 或 for-of 因为 WebStorm 不识别。
packages.forEach(({ name, plugins }) => {

	/**
	 * 验证扩展已经添加了相关的插件，无需写 plugins: [...]。
	 */
	it("should add plugins from " + name, async () => {
		const { default: items } = await import(name);

		const revolved = items
			.map(i => i.plugins)
			.filter(Boolean)
			.flatMap(Object.keys);

		assert.deepEqual([...new Set(revolved)], plugins);
	});

	/**
	 * Check all rules in the config must change the rules of the base config.
	 */
	it("should not have redundant rules - " + name, async () => {
		const { default: items } = await import(name);
		const base = items.slice(0, -1);
		const custom = items.at(-1);

		const resolved = {};
		for (const item of base) {
			Object.assign(resolved, item.rules);
		}

		for (const [k, v] of Object.entries(custom.rules ?? {})) {
			const fromExt = resolved[k];
			const [level, ...options] = normalize(v);

			if (level === "off" && !fromExt) {
				assert.fail(`${k} = off is redundant`);
			}

			const [baseLevel, ...baseOptions] = normalize(fromExt);
			if (level !== baseLevel) {
				continue;
			}
			assert.notDeepStrictEqual(baseOptions, options, `${k} is redundant`);
		}
	});
});
