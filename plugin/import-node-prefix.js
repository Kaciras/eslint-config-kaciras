import { isBuiltin } from "module";

/**
 *
 * The original code is from the gist (Unlicense)
 * @see https://gist.github.com/alex-kinokon/f8f373e1a6bb01aa654d9085f2cff834
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
	meta: {
		messages: {
			violation: `Import of built-in Node.js module "{{ name }}" must use the "node:" prefix.`,
		},
		type: "problem",
		docs: {
			description: "Force import of Node built-in modules with the `node:` prefix",
			category: "Best Practices",
		},
		schema: [],
		fixable: "code",
	},
	create: context => ({
		ImportDeclaration(node) {
			const { source } = node;

			if (source?.type === "Literal" && typeof source.value === "string") {
				const name = source.value;

				if (!name.startsWith("node:") && isBuiltin(name)) {
					context.report({
						node: source,
						messageId: "violation",
						data: { name },
						fix: fixer => fixer.replaceText(source, `"node:${name}"`),
					});
				}
			}
		},
	}),
};
