import { RuleTester } from "eslint";
import rule from "../plugin/import-node-prefix.js";

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
			code: "import 'process'",
			output: 'import "node:process"',
			errors: ['Import of built-in Node.js module "process" must use the "node:" prefix.'],
		},
		{
			code: "import x from 'process'",
			output: 'import x from "node:process"',
			errors: ['Import of built-in Node.js module "process" must use the "node:" prefix.'],
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
				'Import of built-in Node.js module "process" must use the "node:" prefix.',
				'Import of built-in Node.js module "fs" must use the "node:" prefix.',
				'Import of built-in Node.js module "module" must use the "node:" prefix.',
			],
		},
	],
});
