import { build } from 'esbuild';

build({
	entryPoints: ['src/atoms.js'],
	outdir: 'dist',
	bundle: true,
	sourcemap: true,
	minify: true,
	splitting: true,
	treeShaking: true,
	format: 'esm',  // Output format is ESM
	target: ['esnext'],
	external: ['@base-framework/base']
})
.catch(() => process.exit(1));