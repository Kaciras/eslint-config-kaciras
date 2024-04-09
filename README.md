# eslint-config-kaciras

[![Test](https://github.com/Kaciras/eslint-config-kaciras/actions/workflows/test.yml/badge.svg)](https://github.com/Kaciras/eslint-config-kaciras/actions/workflows/test.yml)

Kaciras JavaScript style.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
pnpm add eslint
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

All packages are ESM and export flat configs, they cannot be used for legacy project.

```javascript
import core from "@kaciras/eslint-config-core";
import typescript from "@kaciras/eslint-config-typescript";
import jest from "@kaciras/eslint-config-jest";
import react from "@kaciras/eslint-config-react";
import vueTs from "@kaciras/eslint-config-vue/typescript.js";

export default [
    ...core,
    ...typescript, // for TS project
    ...vueTs, // for Vue & Typescript

    // for project uses Jest
    ...jest.map(config => ({ ...config, files: ["<test match pattern>"]})),

    // for React project
    ...react.map(config => ({ ...config, files: ["**/*.[jt]sx"]})),
    
    {
        rules: {
            "kaciras/import-group-sort": "warn",
        },
    },
];
```
