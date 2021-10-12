# eslint-config-kaciras

[![Test](https://github.com/Kaciras/eslint-config-kaciras/actions/workflows/test.yml/badge.svg)](https://github.com/Kaciras/eslint-config-kaciras/actions/workflows/test.yml)

Kaciras JavaScript style.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
npm i eslint
```

Next, install config packages:

```
npm i -D @kaciras/eslint-config-core

// If the project uses typescript
npm i -D @kaciras/eslint-config-typescript

// If the project uses react
npm i -D @kaciras/eslint-config-react

// If the project uses Jest
npm i -D @kaciras/eslint-config-jest

// If the project uses Vue
npm i -D @kaciras/eslint-config-vue
```

## Usage

Add `@kaciras/*` to the `extends` section of your `.eslintrc` configuration file.

```javascript
module.exports = {
	root: true,
	extends: [
		"@kaciras/core",
		"@kaciras/typescript", // for TS project
		"@kaciras/react", // for React project

		"@kaciras/vue", // for Vue project or
		"@kaciras/vue/typescript", // for Vue & Typescript
	],
	// for project uses Jest
	overrides: [{
		files: "<test match pattern>",
		extends: ["@kaciras/jest"],
	}],
};
```
