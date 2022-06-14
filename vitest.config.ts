import { resolve as _resolve } from 'path'
import { defineConfig } from 'vitest/config'

const resolve = (p: string) => _resolve(__dirname, p)

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /@vue\/(.*)/,
        replacement: resolve('packages/$1/src'),
      },
    ],
  },
})
