import { createRequire } from "module";
import { RuleTester } from "eslint";
import rule from "../plugin/import-group-sort.js";

function join(...list) {
	return list.join("\n") + "\n";
}

const testerJS = new RuleTester({
	parserOptions: {
		sourceType: "module",
		ecmaVersion: "latest",
	},
});

// TODO: import assertion is only a stage 3 proposal, test it when ESLint supported.
testerJS.run("import-group-sort", rule, {
	valid: [
		join(
			"import 'process';",
			"import 'eslint';",
			"import './test';",
		),
		join(
			"import 'node:path';",
			"import 'eslint';",
		),
	],
	invalid: [
		{
			code: join(
				"import './test';",
				"import 'eslint';",
			),
			output: join(
				"import 'eslint';",
				"import './test';",
			),
			errors: ["node modules should before local files"],
		},
		{
			code: join(
				"import './test';",
				"import '@/alias';",
			),
			output: join(
				"import '@/alias';",
				"import './test';",
			),
			errors: ["node modules should before local files"],
		},
		{
			code: join(
				"import './test';",
				"import 'module';",
			),
			output: join(
				"import 'module';",
				"import './test';",
			),
			errors: ["builtin modules should before local files"],
		},
		{
			code: join(
				"import 'file:./test';",
				"import 'module';",
			),
			output: join(
				"import 'module';",
				"import 'file:./test';",
			),
			errors: ["builtin modules should before local files"],
		},
		{
			code: join(
				"import 'data:text/javascript,alert(1)';",
				"import 'module';",
			),
			output: join(
				"import 'module';",
				"import 'data:text/javascript,alert(1)';",
			),
			errors: ["builtin modules should before local files"],
		},
		{
			code: join(
				"import 'eslint';",
				"import 'path';",
			),
			output: join(
				"import 'path';",
				"import 'eslint';",
			),
			errors: ["builtin modules should before node modules"],
		},
		{
			code: join(
				"import 'eslint';",
				"import 'node:path';",
			),
			output: join(
				"import 'node:path';",
				"import 'eslint';",
			),
			errors: ["builtin modules should before node modules"],
		},
		{
			code: "import 'eslint';import 'path';",
			output: "import 'path';import 'eslint';",
			errors: ["builtin modules should before node modules"],
		},
		{
			code: join(
				"import 'eslint';",
				"import 'path'; // comment",
			),
			output: join(
				"import 'path'; // comment",
				"import 'eslint';",
			),
			errors: ["builtin modules should before node modules"],
		},
		{
			code: join(
				"import 'process';",
				"",
				"import 'eslint';",
				"import 'node:path';",
			),
			output: join(
				"import 'process';",
				"import 'node:path';",
				"",
				"import 'eslint';",
			),
			errors: ["builtin modules should before node modules"],
		},
	],
});

const testerTS = new RuleTester({
	parser: createRequire(import.meta.url).resolve("@typescript-eslint/parser"),
	parserOptions: {
		sourceType: "module",
		ecmaVersion: "latest",
	},
});

testerTS.run("import-group-sort", rule, {
	valid: [
		join(
			"import type S from './some-file';",
			"import fs from 'fs';",
		),
		join(
			"import type { URL } from 'url';",
			"import type S from './some-file'",
		),
	],
	invalid: [
		{
			code: join(
				"import fs from 'fs';",
				"import type S from './some-file'",
			),
			output: join(
				"import type S from './some-file'",
				"import fs from 'fs';",
			),
			errors: ["type import should before value import"],
		},
		{
			code: join(
				"import type S from './some-file';",
				"import type { URL } from 'url';",
			),
			output: join(
				"import type { URL } from 'url';",
				"import type S from './some-file';",
			),
			errors: ["builtin modules should before local files"],
		},
	],
});
