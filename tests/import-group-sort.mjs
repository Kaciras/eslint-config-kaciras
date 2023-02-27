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
		{
			code: join(
				"import './test.js';",
				"import 'eslint';",
			),
			options: [
				"ImportType", "Import", "TsImportEquals",
				"Local", "Builtin", "NodeModule",
			],
		},
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
			errors: ["3rd party modules should before local files"],
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
			errors: ["3rd party modules should before local files"],
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
			errors: ["builtin modules should before 3rd party modules"],
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
			errors: ["builtin modules should before 3rd party modules"],
		},

		// Fix with multiple tokens in the line.
		{
			code: join(
				"import 'eslint';",
				"import 'path'; /*foo*/ //bar",
			),
			output: join(
				"import 'path'; /*foo*/ //bar",
				"import 'eslint';",
			),
			errors: ["builtin modules should before 3rd party modules"],
		},
		{
			code: join(
				"import 'eslint';",
				"import 'path'; /*foo*/ /*bar\n*/",
			),
			output: join(
				"import 'path'; /*foo*/ ",
				"import 'eslint';",
				"/*bar\n*/",
			),
			errors: ["builtin modules should before 3rd party modules"],
		},
		{
			code: join(
				"import 'eslint';",
				"import 'path'; /*foo*/ const x={",
				"key:123};",
			),
			output: join(
				"import 'path'; /*foo*/ ",
				"import 'eslint';",
				"const x={",
				"key:123};",
			),
			errors: ["builtin modules should before 3rd party modules"],
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
			errors: ["builtin modules should before 3rd party modules"],
		},
		{
			code: join(
				"import eslint from 'eslint';",
				"eslint.run();",
				"import 'node:path';",
			),
			output: join(
				"import 'node:path';",
				"import eslint from 'eslint';",
				"eslint.run();",
			),
			errors: ["builtin modules should before 3rd party modules"],
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
		join(
			"import fs from 'fs';",
			"import Alias = Some.Type;",
		),
		join(
			"import fs from 'fs';",
			"import Alias = require('../local');",
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
		{
			code: join(
				"import Alias = Some.Type;",
				"import fs from 'fs';",
			),
			output: join(
				"import fs from 'fs';",
				"import Alias = Some.Type;",
			),
			errors: ["value import should before type alias"],
		},
		{
			code: join(
				"import Alias = require('../local');",
				"import fs from 'fs';",
			),
			output: join(
				"import fs from 'fs';",
				"import Alias = require('../local');",
			),
			errors: ["builtin modules should before local files"],
		},
	],
});
