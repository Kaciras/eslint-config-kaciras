const isBuiltin = require("is-builtin-module");

const BUILTIN = 0;
const MODULES = 1;
const LOCAL = 2;

// this: sourceCode
function* sort(node, imports, fixer) {
	const text = this.getText(node);
	const k = kindOf(node);
	const f = imports.find(i => kindOf(i) > k);

	yield fixer.remove(node);
	yield fixer.insertTextBefore(f, text);
}

function kindOf(node) {
	const name = node.source.value;
	if (isBuiltin(name)) {
		return BUILTIN;
	}
	return name.startsWith(".") ? LOCAL : MODULES;
}

function check(imports) {
	const code = this.getSourceCode();

	let current = BUILTIN;
	for (const node of imports) {
		const k = kindOf(node);

		if (k < current) {
			this.report({
				node,
				message: "incorrect import order",
				fix: sort.bind(code, node, imports),
			});
		} else {
			current = k;
		}
	}
}

/**
 * 将顶层的导入语句按照模块的位置排序，注意该规则不符合 ESLint 的规范，
 * 因为导入可能有副作用，比如 CSS 文件的导入顺序关系到优先级，请慎用。
 *
 * 默认的顺序是：Node 内置模块 -> 三方包 -> 本地模块。
 *
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
	meta: {
		type: "layout",
		fixable: "code",
		docs: {
			description: "sort imports",
			recommended: false,
			url: "https://eslint.org/docs/rules/no-extra-semi",
		},
	},
	create(context) {
		const imports = [];
		return {
			ImportDeclaration: node => imports.push(node),
			"Program:exit": check.bind(context, imports),
		};
	},
};
