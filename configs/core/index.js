import stylistic from "@stylistic/eslint-plugin-js";
import kaciras from "@kaciras/eslint-plugin";

// Though there is only 1 item, we still export an array for extensibility.
export default [{
	plugins: { kaciras, stylistic },
	name: "kaciras/javascript",
	rules: {
		// Don’t use the dross of weakly typed languages.
		"eqeqeq": 2,

		// Some dross you should never to use.
		"no-throw-literal": 2,
		"no-sequences": 2,
		"no-label-var": 2,
		"no-restricted-syntax": [2, "ForInStatement"],

		// Variable named with only dashes means ignored.
		"no-unused-vars": [2, {
			varsIgnorePattern: "^_+$",
		}],

		// window 对象上一些容易混淆的成员，要求必须以 `window.*` 来调用。
		// 该列表参考了：
		// https://github.com/facebook/create-react-app/tree/master/packages/confusing-browser-globals
		"no-restricted-globals": [2,
			"event", "name", "external",
			"top", "length", "parent",
			"addEventListener", "removeEventListener",
			"close", "closed",
			"focus", "onfocus", "blur", "onblur",
			"open", "opener",
			"onload", "onunload",
			"frames", "frameElement",
			"innerWidth", "innerHeight",
			"outerWidth", "outerHeight",
			"pageXOffset", "pageYOffset",
			"screenLeft", "screenTop",
			"screenX", "screenY",
			"moveBy", "moveTo",
			"resizeBy", "resizeTo", "onresize",
			"scroll", "scrollBy", "scrollTo",
			"scrollX", "scrollY",
			"status", "defaultStatus",
			"find", "print", "confirm", "stop",
		],

		// Languages with char type all use double quotes for strings,
		// and it's better to be consistent.
		"stylistic/quotes": [2, "double", {
			avoidEscape: true,
		}],

		// I just like using Tab.
		"stylistic/indent": [2, "tab", {
			SwitchCase: 1,
		}],

		// \n is more popular and simpler than \r\n
		"stylistic/linebreak-style": [2, "unix"],

		// Consistency with other languages I use.
		"stylistic/space-before-function-paren": [2, {
			anonymous: "always",
			named: "never",
			asyncArrow: "always",
		}],

		// Essential spaces improve code readability.
		"stylistic/key-spacing": 2,
		"stylistic/object-curly-spacing": [2, "always"],
		"stylistic/space-before-blocks": 2,

		// In rare cases adding a semicolon changes the semantics.
		"stylistic/semi": [2, "always"],

		// Avoid edge cases, and allow move the row to reordering.
		"stylistic/comma-dangle": [2, "always-multiline"],
	},
}];
