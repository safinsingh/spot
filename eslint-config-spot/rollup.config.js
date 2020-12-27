import yaml from '@rollup/plugin-yaml'
import cleaner from 'rollup-plugin-cleaner'

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/index.js',
		format: 'cjs',
		exports: 'default'
	},
	plugins: [cleaner({ targets: ['dist/'] }), yaml()]
}
