import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import rule from "../configs/core/import-node-prefix.js";

function join(...list) {
	return list.join("\n") + "\n";
}

const testerJS = new RuleTester({
	languageOptions: {
		sourceType: "module",
		ecmaVersion: "latest",
	},
});

testerJS.run("import-node-prefix", rule, {
	valid: [
		"import 'node:process'",
		"import 'node:foobar'",
		"import 'eslint'",
		"import './process'",
		"import './process.js'",

		"import x from 'node:process'",
		"import * as x from 'node:process'",
		"import { x } from 'node:process'",
	],
	invalid: [
		{
			code: "import * as x from 'process'",
			output: 'import * as x from "node:process"',
			errors: [
				'Import of built-in Node.js module must use the "node:" prefix.',
			],
		},
		{
			code: join(
				"import x from 'process';",
				"import 'fs';",
				"import { register } from 'module';",
			),
			output: join(
				'import x from "node:process";',
				'import "node:fs";',
				'import { register } from "node:module";',
			),
			errors: [
				'Import of built-in Node.js module must use the "node:" prefix.',
				'Import of built-in Node.js module must use the "node:" prefix.',
				'Import of built-in Node.js module must use the "node:" prefix.',
			],
		},
	],
});
const testerTS = new RuleTester({
	languageOptions: {
		parser: tseslint.parser,
	},
});

testerTS.run("import-node-prefix", rule, {
	valid: [
		"import type x from 'node:process'",
		"import type * as x from 'node:process'",
		"import type { x } from 'node:process'",
		"import { type y } from 'node:process'",
	],
	invalid: [
		{
			code: join(
				"import type x from 'process';",
				"import type { register } from 'module';",
				"import { type y } from 'module';",
			),
			output: join(
				'import type x from "node:process";',
				'import type { register } from "node:module";',
				'import { type y } from "node:module";',
			),
			errors: [
				'Import of built-in Node.js module must use the "node:" prefix.',
				'Import of built-in Node.js module must use the "node:" prefix.',
				'Import of built-in Node.js module must use the "node:" prefix.',
			],
		},
	],
});
