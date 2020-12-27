import typescript from '@rollup/plugin-typescript'
import cleaner from 'rollup-plugin-cleaner'

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/index.js',
		format: 'cjs',
		exports: 'auto'
	},
	plugins: [cleaner({ targets: ['dist/'] }), typescript()],
	external: ['@grpc/proto-loader', 'grpc', 'path']
}
