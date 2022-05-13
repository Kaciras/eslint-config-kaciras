const isBuiltin = require("is-builtin-module");

const BUILTIN = 0;
const MODULES = 1;
const LOCAL = 2;

// this: sourceCode
function* sort(node, imports, fixer) {
	const text = this.getText();
	const k = kindOf(node);
	const f = imports.find(i => kindOf(i) > k);

	const lf = text.indexOf("\n", node.end) + 1;
	const end = lf === 0 ? node.end : lf;

	const line = text.slice(node.start, end);

	yield fixer.removeRange([node.start, end]);
	yield fixer.insertTextBefore(f, line);
}

function kindOf(node) {
	const name = node.source.value;
	if (isBuiltin(name)) {
		return BUILTIN;
	}
	return name.startsWith(".") ? LOCAL : MODULES;
}

// this: Context
function check(program) {
	const code = this.getSourceCode();
	const imports = [];

	let current = BUILTIN;
	for (const node of program.body) {
		if (node.type !== "ImportDeclaration") {
			break;
		}
		imports.push(node);

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
		},
	},
	create(context) {
		return { Program: check.bind(context) };
	},
};
