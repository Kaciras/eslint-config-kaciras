import { isBuiltin } from "module";

/**
 * Report violation if the import source is built-in and not use node: protocol.
 *
 * @this {import('eslint').Rule.RuleContext}
 * @param source {import("estree").ImportDeclaration}
 */
function checkImport({ source }) {
	const name = source.value;
	if (name.startsWith("node:") || !isBuiltin(name)) {
		return;
	}
	this.report({
		messageId: "violation",
		node: source,
		fix: fixer => fixer.replaceText(source, `"node:${name}"`),
	});
}

/**
 * Enforce usage of `node:` prefix for import Node.js built-ins.
 *
 * The relevant proposal received a large number of endorsements, but was not implemented:
 * https://github.com/import-js/eslint-plugin-import/issues/2717
 *
 * The original code is from the gist (Unlicense)
 * @see https://gist.github.com/alex-kinokon/f8f373e1a6bb01aa654d9085f2cff834
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
	meta: {
		messages: {
			violation: `Import of built-in Node.js module must use the "node:" prefix.`,
		},
		type: "problem",
		docs: {
			description: "Force import of Node built-in modules with the `node:` prefix",
			category: "Best Practices",
		},
		schema: [],
		fixable: "code",
	},
	create: context => ({ ImportDeclaration: checkImport.bind(context) }),
};
