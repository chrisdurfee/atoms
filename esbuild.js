import { build } from 'esbuild';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Recursively collects every JavaScript source file under a directory.
 *
 * @param {string} dir - The directory to scan.
 * @returns {string[]} A list of file paths.
 */
const collectEntryPoints = (dir) =>
{
	const entries = [];
	for (const name of readdirSync(dir))
	{
		const path = join(dir, name);
		if (statSync(path).isDirectory())
		{
			entries.push(...collectEntryPoints(path));
			continue;
		}

		if (path.endsWith('.js'))
		{
			entries.push(path);
		}
	}
	return entries;
};

/**
 * The package is published as preserved ES modules (one minified output
 * file per source module) rather than a single bundle. Keeping the module
 * graph intact lets consumer bundlers tree-shake at module granularity, so
 * an app that only imports `Div` never ships the responsive/size-tracking
 * code, and an app that never uses conditional atoms can drop `on.js`.
 *
 * `bundle: false` transpiles each file in place while leaving the
 * relative `import`/`export` statements untouched. The output is left
 * unminified so consumers get readable code and usable stack traces;
 * app bundlers minify the final bundle anyway.
 */
build({
	entryPoints: collectEntryPoints('src'),
	outdir: 'dist',
	outbase: 'src',
	bundle: false,
	sourcemap: false,
	minify: false,
	treeShaking: true,
	format: 'esm',
	target: ['es2020']
})
.catch(() => process.exit(1));
