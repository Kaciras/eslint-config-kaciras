const { builtinModules } = require("module");
const { isCommentToken } = require("eslint-utils");

const builtins = new Set(builtinModules);

const descriptions = {
	ImportType: "type import",
	Import: "value import",
	TsImportEquals: "type alias",

	Builtin: "builtin modules",
	Local: "local files",
	NodeModule: "node modules",
};

const DEFAULT_ORDER = [
	// Top level, import kind.
	"ImportType", "Import", "TsImportEquals",

	// Module location of value import.
	"Builtin", "NodeModule", "Local",
];

/**
 * 获取导入语句的优先级（模块类型），支持完整的 URL。
 *
 * @see https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#urls
 */
function getModuleLocation(node) {
	let [protocol, path] = node.source.value.split(":", 2);
	if (path === undefined) {
		[protocol, path] = [null, protocol];
	}

	switch (protocol) {
		case "node":
			return "Builtin";
		case "file":
		case "data":
			return "Local";
		case null:
			break;
		default:
			return "NodeModule";
	}

	if (path.startsWith(".")) {
		return "Local";
	}

	const slashIndex = path.indexOf("/");
	const root = slashIndex === -1
		? path
		: path.slice(0, slashIndex);

	return builtins.has(root) ? "Builtin" : "NodeModule";
}

/**
 * Get import kinds of the node.
 *
 * @param node espree node
 * @return {string[] | undefined} kind array, or undefined if the node is not an import statement.
 */
function getImportKinds(node) {
	const { type } = node;

	if (type === "TSImportEqualsDeclaration") {
		return ["TsImportEquals"];
	}
	if (type === "ImportDeclaration") {
		// importKind is added by TypeScript parser。
		const type = node.importKind === "type"
			? "ImportType" : "Import";
		return [type, getModuleLocation(node)];
	}
}

function compare(w1, w2) {
	for (let i = 0; i < w1.length; i++) {
		if (w1[i] > w2[i]) {
			return { i, result: 1 };
		}
		if (w1[i] < w2[i]) {
			return { i, result: -1 };
		}
	}
	return { i: NaN, result: 0 };
}

/**
 * 尝试获取节点所在的所有行的范围，即将 node.range[1] 扩展到行尾。
 * 如果行内还有其它无法移动的代码则原样返回 node.range。
 *
 * @param sourceCode 源码
 * @param node 节点
 * @return {[number,number]} 开始-结束二元组
 */
function getWholeLines(sourceCode, node) {
	const [start, end] = node.range;
	const lf = sourceCode.getText().indexOf("\n", end);

	// 本节点是最后一行，范围无需改变。
	if (lf === -1) {
		return node.range;
	}

	const next = sourceCode.getTokenAfter(node, { includeComments: true });

	// 本行没有其它节点，直接扩展到行尾。
	if (!next || next.range[0] > lf) {
		return [start, lf + 1];
	}

	// 行内有其他有效语句，保守起见不扩展。
	if (!isCommentToken(next)) {
		return node.range;
	}

	// 注释如果在同一行内结束则视为该导入的一部分。
	return next.range[1] > lf ? node.range : [start, lf + 1];
}

// this: SourceCode
function* sort(info, imports, fixer) {
	const { node, weight } = info;
	const i = imports.findIndex(i => compare(i.weight, weight).result === 1);

	const srcRange = getWholeLines(this, node);
	const line = this.getText().slice(...srcRange);

	yield fixer.removeRange(srcRange);
	if (i === 0) {
		yield fixer.insertTextBefore(imports[i].node, line);
	} else {
		const r = getWholeLines(this, imports[i - 1].node);
		yield fixer.insertTextAfterRange(r, line);
	}
}

// this: Context
function check(program, orders = DEFAULT_ORDER) {
	const code = this.getSourceCode();
	const imports = [];

	// Only the weight is used in initial properties.
	let prev = { node: null, kinds: [], weight: [0, 0] };

	const orderMap = {};
	for (let i = 0; i < orders.length; i++) {
		orderMap[orders[i]] = i;
	}

	for (const node of program.body) {
		const kinds = getImportKinds(node);
		if (kinds === undefined) {
			break;
		}

		const weight = new Array(kinds.length);
		for (let i = 0; i < kinds.length; i++) {
			weight[i] = orderMap[kinds[i]];
		}

		const info = { node, kinds, weight };
		imports.push(info);

		const { i, result } = compare(weight, prev.weight);

		if (result !== -1) {
			prev = info;
		} else {
			const lm = descriptions[kinds[i]];
			const rm = descriptions[prev.kinds[i]];

			this.report({
				node,
				message: `${lm} should before ${rm}`,
				fix: sort.bind(code, info, imports),
			});
		}
	}
}

/**
 * 将顶层的导入语句按照模块的位置排序，注意该规则不符合 ESLint 的规范，
 * 因为导入可能有副作用，比如 CSS 文件的导入顺序关系到优先级，请慎用。
 *
 * 使用了别名的导入暂不支持自定义，一律视为三方包。
 * 默认的顺序是：
 * 1）import type, 标准 import, import xxx =。
 * 2）Node 内置模块, 三方包, 本地模块。
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
