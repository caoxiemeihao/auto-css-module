
const modules = import.meta.glob('./views/*/index.ts', { eager: true })

const htmls: string[] = []

for (const [name, mod] of Object.entries(modules)) {
  console.log(name, mod)
  htmls.push(`<div>
  <code>${name}</code>
  <div>${mod.default}</div>
</div>`)
}

document.getElementById('root').innerHTML = htmls.join('<hr />')
