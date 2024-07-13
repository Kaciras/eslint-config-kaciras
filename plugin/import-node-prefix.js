import { isBuiltin } from "module";

/**
 *
 * The original code is from the gist (Unlicense)
 * @see https://gist.github.com/alex-kinokon/f8f373e1a6bb01aa654d9085f2cff834
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
	meta: {
		type: "problem",
		docs: {
			description:
				"Disallow imports of built-in Node.js modules without the `node:` prefix",
			category: "Best Practices",
		},
		fixable: "code",
		schema: [],
	},
	create: context => ({
		ImportDeclaration(node) {
			const { source } = node;

			if (source?.type === "Literal" && typeof source.value === "string") {
				const specifier = source.value;

				if (!specifier.startsWith("node:") && isBuiltin(specifier)) {
					context.report({
						node: source,
						message: `Import of built-in Node.js module "${specifier}" must use the "node:" prefix.`,
						fix: fixer => fixer.replaceText(source, `"node:${specifier}"`),
					});
				}
			}
		},
	}),
};
