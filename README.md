# auto-css-module

It enables css-module in Babel, Vite automatically


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
