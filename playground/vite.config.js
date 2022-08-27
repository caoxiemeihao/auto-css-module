import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import autoCssModule from '../dist/vite'

export default defineConfig({
  root: __dirname,
  plugins: [
    autoCssModule(),
    {
      name: 'auto-css-module:test',
      transform(code, id) {
        if (/src\/views\/.+\.ts$/.test(id)) {
          let { dir, name } = path.parse(id)
          dir = dir.replace('src', '__snapshots__/vite')
          !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true })
          // Write transformed code to __snapshots__/vite/*/[name].js
          fs.writeFileSync(path.join(dir, `${name}.js`), code)
        }
      },
      transformIndexHtml(html) {
        return html.replace('</body>', '  <script type="module" src="/src/main.ts"></script>\n</body>')
      },
    },
  ],
  build: {
    minify: false,
  },
})
