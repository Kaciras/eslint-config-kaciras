import rule from "../plugin/import-group-sort.js";
import { RuleTester } from "eslint";

const tester = new RuleTester({
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
});

tester.run("my-rule", rule, {
	valid: [
		{
			code: "import s from 'path';\nimport d from './test'",
		},
	],
	invalid: [
		{
			code: "import s from './test';\nimport d from 'path'",
			errors: [{}],
		},
	],
});
