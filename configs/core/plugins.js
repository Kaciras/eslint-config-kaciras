import importSpecifierOrder from "./import-specifier-order.js";
import importNodePrefix from "./import-node-prefix.js";
import packageJSON from "./package.json" with { type: "json" };

export default {
	meta: {
		version: packageJSON.version,
		name: packageJSON.name,
	},
	rules: {
		"import-specifier-order": importSpecifierOrder,
		"import-node-prefix": importNodePrefix,
	},
};
