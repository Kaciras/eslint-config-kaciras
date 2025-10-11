import assert from "assert";
import { Linter } from "eslint";
import coreConfig from "../configs/core/index.js";
import tsConfig from "../configs/typescript/index.js";

const linter = new Linter();

it("should ignore unused var with name _", async () => {
	const message = linter.verify("const _ = 1;", coreConfig);
	assert.strictEqual(message.length, 0);
});

it("should verify unused vars", async () => {
	const message = linter.verify("const _foo = 1;", coreConfig);
	assert.strictEqual(message.length, 1);
});

it("should verify rules from TS package", async () => {
	const message = linter.verify("type _ = { a,b };", [...coreConfig, ...tsConfig]);
	assert.strictEqual(message.length, 1);
	assert.strictEqual(message[0].ruleId, "stylistic/member-delimiter-style");
});
