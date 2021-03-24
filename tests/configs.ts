import assert from "assert";
import { ESLint } from "eslint";

it("should add plugins from extends", async () => {
	const eslint = new ESLint({
		useEslintrc: false,
		overrideConfigFile: "packages/react/index.js",
	});
	const { plugins } = await eslint.calculateConfigForFile("foobar.jsx");

	assert.strictEqual(plugins.length, 2);
	assert(plugins.includes("react"));
	assert(plugins.includes("react-hooks"));
});
