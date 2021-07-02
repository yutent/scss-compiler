import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'entry.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  external: ['vscode', 'fs', 'path', 'url', 'events'],
  plugins: [
    json(),
    commonjs({
      ignoreDynamicRequires: true
    }),
    resolve()
  ]
}
