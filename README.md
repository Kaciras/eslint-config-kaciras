# eslint-config-kaciras

[![Test](https://github.com/Kaciras/eslint-config-kaciras/actions/workflows/test.yml/badge.svg)](https://github.com/Kaciras/eslint-config-kaciras/actions/workflows/test.yml)

ESLint config for Kaciras.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint
```

Next, install config packages:

```
$ npm i -D @kaciras/eslint-config-core

// If your project use typescript
$ npm i -D @kaciras/eslint-config-typescript

// If your project use react
$ npm i -D @kaciras/eslint-config-react

// If your project use Jest
$ npm i -D @kaciras/eslint-config-jest
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
    ],
    // for project use Jest
    overrides: [{
        files: require("./jest.config").testMatch,
        extends: ["@kaciras/jest"],
    }],
};
```
