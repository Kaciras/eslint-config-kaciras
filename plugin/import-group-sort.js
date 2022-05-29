const { builtinModules } = require("module");

const builtins = new Set(builtinModules);

const BUILTIN = 0;
const DEPENDENCY = 1;
const LOCAL = 2;

const names = [
	"builtin modules",
	"node modules",
	"local files",
];

// this: sourceCode
function* sort(node, imports, fixer) {
	const text = this.getText();
	const k = kindOf(node);
	const f = imports.find(i => kindOf(i) > k);

	const lf = text.indexOf("\n", node.range[1]) + 1;
	const end = lf === 0 ? node.range[1] : lf;
	const line = text.slice(node.range[0], end);

	yield fixer.removeRange([node.range[0], end]);
	yield fixer.insertTextBefore(f, line);
}

/**
 * 获取导入语句的优先级（模块类型），支持完整的 URL。
 *
 * @param node Import 语句的 AST 节点
 * @returns {number} 优先级，越小越靠前
 * @see https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#urls
 */
function kindOf(node) {
	let [protocol, path] = node.source.value.split(":", 2);
	if (path === undefined) {
		[protocol, path] = [null, protocol];
	}

	switch (protocol) {
		case "node":
			return BUILTIN;
		case "file":
		case "data":
			return LOCAL;
		case null:
			break;
		default:
			return DEPENDENCY;
	}

	if (path.startsWith(".")) {
		return LOCAL;
	}

	const slashIndex = path.indexOf("/");
	const root = slashIndex === -1
		? path
		: path.slice(0, slashIndex);

	return builtins.has(root) ? BUILTIN : DEPENDENCY;
}

// this: Context
function check(program) {
	const code = this.getSourceCode();
	const imports = [];
	let prev = BUILTIN;

	for (const node of program.body) {
		if (node.type !== "ImportDeclaration") {
			break;
		}
		imports.push(node);

		const k = kindOf(node);
		if (k < prev) {
			this.report({
				node,
				message: `${names[k]} should before ${names[prev]}`,
				fix: sort.bind(code, node, imports),
			});
		} else {
			prev = k;
		}
	}
}

/**
 * 将顶层的导入语句按照模块的位置排序，注意该规则不符合 ESLint 的规范，
 * 因为导入可能有副作用，比如 CSS 文件的导入顺序关系到优先级，请慎用。
 *
 * 使用了别名的导入暂不支持自定义，一律视为三方包。
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
