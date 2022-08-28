
// const modules = import.meta.glob('./views/*/index.ts', { eager: true })
import * as foo from './views/foo'
import * as bar from './views/bar'

const modules = {
  './views/foo/index.ts': foo,
  './views/bar/index.ts': bar,
}

const htmls: string[] = []

for (const [name, mod] of Object.entries(modules)) {
  console.log(name, mod)
  htmls.push(`<div>
  <code>${name}</code>
  <div>${mod.default}</div>
</div>`)
}

document.getElementById('root').innerHTML = htmls.join('<hr />')
