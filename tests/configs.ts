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

it("should add plugins from extends", async () => {
	const { plugins } = await getConfig("foobar.jsx", {
		extends: ["./packages/react"],
	});

	assert.strictEqual(plugins.length, 2);
	assert(plugins.includes("react"));
	assert(plugins.includes("react-hooks"));
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
