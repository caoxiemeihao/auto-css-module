# auto-css-module

It enables css-module in Babel, Vite automatically

[![NPM version](https://img.shields.io/npm/v/auto-css-module.svg)](https://npmjs.org/package/auto-css-module)
[![NPM Downloads](https://img.shields.io/npm/dm/auto-css-module.svg?style=flat)](https://npmjs.org/package/auto-css-module)

```js
// You code
import style from 'style.css'

// Vite
import style from 'style.css?.module.css'

// Babel
import style from 'style.css?modules'
```

## Install

```bash
npm i auto-css-module -D
```

## Usage

- Vite

```js
import autoCssModule from 'auto-css-module/vite'

export default {
  plugins: [
    autoCssModule(/* options */)
  ]
}
```

- Babel

```js
module.exports = {
  plugins: [
    ['auto-css-module/babel', /* options */],
  ],
}
```
