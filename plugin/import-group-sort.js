const { builtinModules } = require("module");

const builtins = new Set(builtinModules);

const BUILTIN = 0;
const DEPENDENCY = 1;
const LOCAL = 2;

const layers = [
	{
		names: ["type import", "value import"],

		// importKind 是 TypeScript parser 添加的额外属性。
		getWeight(node) {
			return node.importKind === "type" ? 0 : 1;
		},
	},
	/**
	 * 获取导入语句的优先级（模块类型），支持完整的 URL。
	 *
	 * @see https://nodejs.org/dist/latest-v18.x/docs/api/esm.html#urls
	 */
	{
		names: [
			"builtin modules",
			"node modules",
			"local files",
		],
		getWeight(node) {
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
		},
	},
];

/**
 * 获取节点所在的所有行的范围，即将 range[1] 扩展到行尾。
 *
 * 该函数无法处理的一些情况：
 * 1）import 所在的行有多个语句。
 * 2）末尾有注释且未在本行内结束。
 *
 * 这些都是不规范的代码，本身就不该出现，所以 OK。
 *
 * @param text 源代码文本
 * @param node 节点
 * @return {[number,number]} 开始-结束二元组
 */
function getWholeLines(text, node) {
	const [start, end] = node.range;
	const lf = text.indexOf("\n", end) + 1;
	return lf === 0 ? node.range : [start, lf];
}

// this: SourceCode
function* sort(node, imports, fixer) {
	const text = this.getText();
	const k = getWeight(node);
	const i = imports.findIndex(i => compare(getWeight(i), k).result === 1);

	const srcRange = getWholeLines(text, node);
	const line = text.slice(...srcRange);

	yield fixer.removeRange(srcRange);
	if (i === 0) {
		yield fixer.insertTextBefore(imports[i], line);
	} else {
		const r = getWholeLines(text, imports[i - 1]);
		yield fixer.insertTextAfterRange(r, line);
	}
}

function getWeight(node) {
	return layers.map(s => s.getWeight(node));
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

// this: Context
function check(program) {
	const code = this.getSourceCode();
	const imports = [];
	let prev = [0, 0];

	for (const node of program.body) {
		if (node.type !== "ImportDeclaration") {
			break;
		}
		imports.push(node);

		const curr = getWeight(node);
		const { i, result } = compare(curr, prev);

		if (result === -1) {
			const lm = layers[i].names[curr[i]];
			const rm = layers[i].names[prev[i]];

			this.report({
				node,
				message: `${lm} should before ${rm}`,
				fix: sort.bind(code, node, imports),
			});
		} else {
			prev = curr;
		}
	}
}

/**
 * 将顶层的导入语句按照模块的位置排序，注意该规则不符合 ESLint 的规范，
 * 因为导入可能有副作用，比如 CSS 文件的导入顺序关系到优先级，请慎用。
 *
 * 使用了别名的导入暂不支持自定义，一律视为三方包。
 * 默认的顺序是：
 * 1）import type -> 标准 import。
 * 2）Node 内置模块 -> 三方包 -> 本地模块。
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
