const isBuiltin = require("is-builtin-module");

const BUILTIN = 0;
const MODULES = 1;
const LOCAL = 2;

// this: node
function rerange(imports, fixer) {

}

function kindOf(name) {
	if (isBuiltin(name)) {
		return BUILTIN;
	}
	return name.startsWith(".") ? LOCAL : MODULES;
}

function check(imports) {
	let group = BUILTIN;
	for (const node of imports) {
		const k = kindOf(node.source.value);
		if (k < group) {
			this.report({
				node,
				message: "test",
				fix: rerange.bind(node, imports),
			});
		} else {
			group = k;
		}
	}
}

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
	meta: {
		type: "suggestion",
		docs: {
			description: "sort imports",
			category: "Suggestions",
			recommended: true,
			url: "https://eslint.org/docs/rules/no-extra-semi",
		},
		fixable: "code",
	},
	create(context) {
		const imports = [];
		return {
			ImportDeclaration: node => imports.push(node),
			"Program:exit": check.bind(context, imports),
		};
	},
};
