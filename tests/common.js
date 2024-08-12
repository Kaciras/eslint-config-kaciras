import assert from "assert";
import { ESLint } from "eslint";

/**
 * Calculate the final config used to lint the file.
 *
 * @param config Flat config array.
 * @param filename Name of the file to lint.
 * @return {Promise<any>} The resolving is asynchronous.
 */
export function resolveConfig(config, filename) {
	const eslint = new ESLint({
		overrideConfig: config,
		overrideConfigFile: true,
	});
	return eslint.calculateConfigForFile(filename);
}

function normalizeRule(rule) {
	if (!Array.isArray(rule)) {
		rule = [rule];
	}
	let [severity, ...options] = rule;
	switch (severity) {
		case 0:
			severity = "off";
			break;
		case 1:
			severity = "warn";
			break;
		case 2:
			severity = "error";
			break;
	}
	return [severity, ...options];
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
		plugins: ["@typescript-eslint", "stylisticTs"],
	},
];

/*
 * Don't use the describe or for-loop because WebStorm cannot recognize them。
 * https://mochajs.org/#dynamically-generating-tests
 */
packages.forEach(({ name, plugins }) => {

	it("should add plugins from " + name, async () => {
		const { default: items } = await import(name);
		const revolved = items.map(i => i.plugins).filter(Boolean).flatMap(Object.keys);

		assert.deepEqual([...new Set(revolved)], plugins);
	});

	it("should not have redundant rules - " + name, async () => {
		const { default: items } = await import(name);
		const custom = items.at(-1);
		const resolved = items.slice(0, -1).reduce((a, b) => Object.assign(a, b.rules), {});

		for (const [k, v] of Object.entries(custom.rules ?? {})) {
			const fromExt = resolved[k];
			const [level, ...options] = normalizeRule(v);

			if (level === "off" && !fromExt) {
				assert.fail(`${k} = off is redundant`);
			}

			const [baseLevel, ...baseOptions] = normalizeRule(fromExt);
			if (level !== baseLevel) {
				continue;
			}
			assert.notDeepStrictEqual(baseOptions, options, `${k} is redundant`);
		}
	});
});
