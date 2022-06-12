const { resolve } = require('path')
const { build } = require('esbuild')
const args = require('minimist')(process.argv.slice(2))

const target = args._[0] || 'reactivity'
const format = args.f || 'esm'

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

build({
  entryPoints: [
    resolve(__dirname, `../packages/${target}/src/index.ts`),
  ],
  outfile,
  bundle: true,
  sourcemap: true,
  format,
  globalName: pkg.buildOptions.name,
  platform: format === 'cjs' ? 'node' : 'browser',
  watch: {
    onRebuild(error) {
      if (!error)
        console.log(`${target} rebuilt`)
    },
  },
}).then(() => console.log(`${target} watching`))
