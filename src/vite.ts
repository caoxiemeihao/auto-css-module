import path from 'path'
import type {
  Plugin,
  ResolvedConfig,
  ResolveFn,
} from 'vite'
import {
  DEFAULT_EXTENSIONS,
  KNOWN_SFC_EXTENSIONS,
  MagicString,
  walk,
} from 'vite-plugin-utils'

export interface Options {
  filter?: (id: string) => false | void
}

// https://github.com/vitejs/vite/blob/cc8800a8e7613961144a567f4024b71f218224f8/packages/vite/src/node/plugins/css.ts#L107-L108
const cssLangs = `\\.(css|less|sass|scss|styl|stylus|pcss|postcss)`
const cssLangRE = new RegExp(cssLangs)
const cssModuleRE = new RegExp(`\\.module${cssLangs}`)

export default function autoCssModule(options: Options = {}): Plugin {
  const extensions = DEFAULT_EXTENSIONS.concat(KNOWN_SFC_EXTENSIONS)
  let globExtensions: string[]
  let config: ResolvedConfig
  let resolve: ResolveFn

  return {
    name: 'auto-css-module:vite',
    configResolved(_config) {
      config = _config
      globExtensions = config.resolve?.extensions || extensions
      resolve = _config.createResolver({ preferRelative: true })
    },
    transform(code, id) {

      if (/node_modules\/(?!\.vite\/)/.test(id)) return
      if (!extensions.includes(path.extname(id))) return
      if (options.filter?.(id) === false) return
      if (!cssLangRE.test(code)) return

      const ast = this.parse(code)
      const ms = new MagicString(code)

      // console.log(ast)
      walk.sync(ast, {
        ImportDeclaration(node) {
          if (!node.specifiers.length) return
          const importee = node.source.value
          if (cssModuleRE.test(importee)) return
          const suffix = cssLangRE.exec(importee)?.[0]
          if (!suffix) return
          ms.overwrite(
            node.source.start + 1,
            node.source.end - 1,
            importee + `${importee.includes('?') ? '&' : '?'}.module${suffix}`,
          )
        },
        // TODO:
        // e.g.
        // const styles = await import('./index.less');
      })

      const str = ms.toString()
      return str === code ? undefined : str
    },
  }
}
