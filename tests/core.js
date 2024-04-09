import assert from "assert";
import { Linter } from "eslint";
import coreConfig from "../configs/core/index.js";
import { resolveConfig } from "./common.js";

const config = await resolveConfig(coreConfig, "dummy.js");

const linter = new Linter();

it("should ignore unused var with name _", async () => {
	const message = linter.verify("const _ = 1;", config);
	assert.strictEqual(message.length, 0);
});

it("should verify unused vars", async () => {
	const message = linter.verify("const _foo = 1;", config);
	assert.strictEqual(message.length, 1);
});
