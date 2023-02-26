const { builtinModules } = require("module");
const { isCommentToken } = require("eslint-utils");

const builtins = new Set(builtinModules);

const descriptions = {
	ImportType: "type import",
	Import: "value import",
	TsImportEquals: "type alias",

	Builtin: "builtin modules",
	Local: "local files",
	NodeModule: "3rd party modules",
};

const DEFAULT_ORDER = [
	// Top level, import kind.
	"ImportType", "Import", "TsImportEquals",

	// Module location of value import.
	"Builtin", "NodeModule", "Local",
];

/**
 * Get module type by URL schema or file location.
 *
 * @see https://nodejs.org/dist/latest-v19.x/docs/api/esm.html#urls
 */
function getModuleLocation(source) {
	let [protocol, path] = source.value.split(":", 2);
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
	if (node.type === "TSImportEqualsDeclaration") {
		const { type, expression } = node.moduleReference;
		if (type !== "TSExternalModuleReference") {
			return ["TsImportEquals"];						// import x = Foo.Bar;
		}
		return ["Import", getModuleLocation(expression)];	// import x = require("expression");
	}
	if (node.type === "ImportDeclaration") {
		// importKind is added by TypeScript parser。
		const type = node.importKind === "type"
			? "ImportType" 									// import type x from "source"
			: "Import";										// import x from "source"
		return [type, getModuleLocation(node.source)];
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

function tryGetWholeLines(sourceCode, node) {
	const [start, end] = node.range;
	const lf = sourceCode.getText().indexOf("\n", end);

	// Last line，no change needed.
	if (lf === -1) {
		return node.range;
	}

	const next = sourceCode.getTokenAfter(node, { includeComments: true });

	// No more nodes in the line，expand range to line end.
	if (!next || next.range[0] > lf) {
		return [start, lf + 1];
	}

	if (!isCommentToken(next)) {
		return node.range;
	}

	// Comments end on the same line are considered part of the statement.
	return next.range[1] > lf ? node.range : [start, lf + 1];
}

// this: SourceCode
function* sort(info, imports, fixer) {
	const { node, weight } = info;
	const i = imports.findIndex(i => compare(i.weight, weight).result === 1);

	const srcRange = tryGetWholeLines(this, node);
	const line = this.getText().slice(...srcRange);

	yield fixer.removeRange(srcRange);
	if (i === 0) {
		yield fixer.insertTextBefore(imports[i].node, line);
	} else {
		const r = tryGetWholeLines(this, imports[i - 1].node);
		yield fixer.insertTextAfterRange(r, line);
	}
}

// this: Context
function check(orders, program) {
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
			continue;
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
 * Sort static imports by type and module location.
 *
 * Note that this rule does not conform to the ESLint specification,
 * as the import may have side effects, such as the import order
 * of CSS files being related to priority, so use it with caution.
 *
 * Default order:
 * 1）import type  >    import    > import equals。
 * 2）Node builtin > node_modules > local files。
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
		schema: {
			type: "array",
			items: {
				enum: DEFAULT_ORDER,
			},
			minItems: 0,
			uniqueItems: true,
		},
	},
	create(context) {
		const { options } = context;
		let orders;

		if (options.length === DEFAULT_ORDER.length) {
			orders = options;
		} else if (options.length === 0) {
			orders = DEFAULT_ORDER;
		} else {
			throw new Error("Custom order must includes all types of imports");
		}

		return { Program: check.bind(context, orders) };
	},
};
