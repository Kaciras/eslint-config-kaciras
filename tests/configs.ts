import assert from "assert";
import { ESLint } from "eslint";

it("should add plugins from extends", async () => {
	const eslint = new ESLint({
		useEslintrc: false,
		overrideConfigFile: "packages/react/index.js",
	});
	const config = await eslint.calculateConfigForFile("test.jsx");

	assert.strictEqual(config.plugins.length, 2);
	assert(config.plugins.includes("react"));
	assert(config.plugins.includes("react-hooks"));
});
