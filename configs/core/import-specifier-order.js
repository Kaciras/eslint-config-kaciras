import { isBuiltin } from "module";

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

const cssRE = /\.(?:css|less|sass|scss|styl|pcss)(?:\?|$)/;

/**
 * Get module type by URL schema or file location.
 *
 * @param value {string} module specifier
 * @see https://nodejs.org/dist/latest-v20.x/docs/api/esm.html#urls
 */
function getModuleLocation(value) {
	let [protocol, path] = value.split(":", 2);
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

	return isBuiltin(root) ? "Builtin" : "NodeModule";
}

/**
 * Get import kind (type of regular) and module specifier of the node.
 *
 * @param node estree node
 * @return {[string, string] | undefined} kind and module specifier tuple,
 *         or undefined if the node is not an import statement.
 */
function parseImport(node) {
	if (node.type === "ImportDeclaration") {
		// importKind is added by TypeScript parser。
		const type = node.importKind === "type"
			? "ImportType" 						// import type x from "source"
			: "Import";							// import x from "source"
		return [type, node.source.value];
	}
	if (node.type === "TSImportEqualsDeclaration") {
		const { type, expression } = node.moduleReference;
		if (type !== "TSExternalModuleReference") {
			return ["TsImportEquals"];			// import x = Foo.Bar;
		}
		return ["Import", expression.value];	// import x = require("expression");
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
 * We consider comments on the same line and after the import
 * as descriptions of the import, and they will be moved together.
 */
function tryExpandEnd(sourceCode, node) {
	const text = sourceCode.getText();
	let nl = text.indexOf("\n", node.range[1]) + 1;

	// File does not have a blank line at the end.
	if (nl === 0) {
		nl = text.length;
	}

	/*
	 * The real end is the start of the next token that cross the LF,
	 * or just the LF if the next token is in the different line.
	 *
	 * Since ESLint uses `getComments*` and `getToken*` to get comments
	 * and non-comment tokens respectively, we need to do the work twice.
	 */
	const comment = sourceCode.getCommentsAfter(node)
		.find(c => c.range[1] >= nl);

	if (comment) {
		return Math.min(nl, comment.range[0]);
	}

	const nextToken = sourceCode.getTokenAfter(node);
	if (!nextToken) {
		return nl; // node is the last non-comment token.
	}
	return Math.min(nl, nextToken.range[0]);
}

/**
 * @param sourceCode {import("eslint").SourceCode}
 * @param node
 * @return {[number, number]}
 */
function tryGetWholeLines(sourceCode, node) {
	return [node.range[0], tryExpandEnd(sourceCode, node)];
}

/**
 * @typedef {object} WeightInfo
 * @property {any} node
 * @property {string[]} kinds
 * @property {number[]} weight
 */

/**
 * @this {import("eslint").SourceCode}
 * @param info {WeightInfo}
 * @param imports
 * @param fixer {import("eslint").Rule.RuleFixer}
 * @return {Generator<import("eslint").Rule.Fix>}
 */
function* sort(info, imports, fixer) {
	const { node, weight } = info;
	const i = imports.findIndex(i => compare(i.weight, weight).result === 1);

	const range = tryGetWholeLines(this, node);
	let line = this.getText().slice(range[0], range[1]);

	if (!line.endsWith("\n")) {
		line += "\n";
	}

	yield fixer.removeRange(range);
	if (i === 0) {
		yield fixer.insertTextBefore(imports[0].node, line);
	} else {
		const r = tryGetWholeLines(this, imports[i - 1].node);
		if (this.getText()[r[1] - 1] !== "\n") {
			line = "\n" + line;
		}
		yield fixer.insertTextAfterRange(r, line);
	}
}

/**
 * @this {import('eslint').Rule.RuleContext}
 * @param orderMap {Record<string, number>}
 * @param exclude {RegExp}
 * @param program {import("estree").Program}
 */
function check(orderMap, exclude, program) {
	const code = this.sourceCode;
	const imports = [];

	let prev = { node: null, kinds: [], weight: [0, 0] };

	for (const node of program.body) {
		const [type, source] = parseImport(node) ?? [];

		if (!type || exclude.test(source)) {
			continue;
		}

		const kinds = [type];
		if (source) {
			kinds.push(getModuleLocation(source));
		}

		const weight = kinds.map(k => orderMap[k]);

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
				messageId: "violation",
				data: { lm, rm },
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
export default {
	meta: {
		messages: {
			violation: "{{ lm }} should go before {{ rm }}",
		},
		type: "layout",
		fixable: "code",
		docs: {
			description: "sort imports by type and module location",
			recommended: false,
		},
		schema: [{
			type: "object",
			properties: {
				order: {
					type: "array",
					items: {
						enum: DEFAULT_ORDER,
					},
					minItems: 0,
					uniqueItems: true,
				},
				exclude: {
					type: "object",
				},
			},
			additionalProperties: false,
		}],
	},
	create(context) {
		const { order = DEFAULT_ORDER, exclude = cssRE } = context.options[0] ?? {};

		if (!(exclude instanceof RegExp)) {
			throw new Error("exclude option must be a RegExp");
		}
		if (order.length !== DEFAULT_ORDER.length) {
			throw new Error("Custom order must includes all types of imports");
		}

		const orderMap = {};
		for (let i = 0; i < order.length; i++) {
			orderMap[order[i]] = i;
		}

		return { Program: check.bind(context, orderMap, exclude) };
	},
};
