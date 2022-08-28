module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['@babel/plugin-transform-typescript', { isTSX: true }],
    autoClassname,
  ]
}

function autoClassname({
  // 默认以 $ 结尾才会绑定
  test = /\$$/,
} = {}) {
  // TODO: multiple import
  let specifier
  return {
    visitor: {
      Program() {
        // Initialize when webpack build reload
        specifier = undefined
      },
      ImportDeclaration({ node }) {
        const importee = node.source.value
        if (importee.includes('node_modules')) return
        const isStyleModule = /\.module\.(less|css|sass|scss|styl)$/.test(importee)
        if (!isStyleModule) return

        for (const n of node.specifiers) {
          if (n.type !== 'ImportDefaultSpecifier') continue

          if (test instanceof RegExp && test.test(n.local.name)) {
            specifier = n.local.name
            break
          }
        }
      },
      CallExpression({ node }) {
        if (!specifier) return

        for (const a of node.arguments) {
          if (a.type !== 'ObjectExpression') continue

          for (const p of a.properties) {
            if (p.key.value !== 'class') continue
            if (p.value.type !== 'StringLiteral') continue

            // Replacement to `style.classname`
            p.value.extra.raw = `${specifier}['${p.value.value}']`
            break
          }
        }
      }
    }
  }
}
