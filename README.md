# eslint-config-kaciras

ESLint config for Kaciras

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
```

## Usage

```javascript
module.exports = {
    root: true,
    plugins: [
       "@kaciras/core",
       "@kaciras/typescript", // for TS project
       "@kaciras/react", // for React project
    ],
};
```
