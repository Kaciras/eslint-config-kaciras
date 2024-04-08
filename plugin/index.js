import importGroupSort from "./import-group-sort.js";
import packageJSON from "./package.json" with { type: "json" };

export default {
	meta: {
		version: packageJSON.version,
		name: packageJSON.name,
	},
	rules: {
		"import-group-sort": importGroupSort,
	},
};
