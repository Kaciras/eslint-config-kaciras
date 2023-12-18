import assert from "assert";
import { Linter } from "eslint";
import { getConfig } from "./common.mjs";

const config = await getConfig("dummy.js",{
	extends: ["./packages/core/index.js"],
});

const linter = new Linter();

it("should ignore unused var with name _",  async () => {
	const message = linter.verify("const _ = 1;", config);
	assert.strictEqual(message.length, 0);
});

it("should verify unused vars",  async () => {
	const message = linter.verify("const _foo = 1;", config);
	assert.strictEqual(message.length, 1);
});
