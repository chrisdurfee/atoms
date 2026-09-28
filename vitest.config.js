import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration.
 *
 * The atoms are browser layout helpers built on the base framework, so
 * every suite runs against a jsdom document. Base module-level
 * singletons (dataBinder, RenderController) probe for `window`/`document`
 * when they are first imported, so the DOM has to exist before any
 * framework module is loaded.
 */
export default defineConfig({
	test: {
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				url: 'http://localhost/'
			}
		},
		include: ['tests/**/*.test.js'],
		setupFiles: ['./tests/setup.js'],
		restoreMocks: true,

		/**
		 * Standing up a jsdom document costs a few seconds per file.
		 * Running the files sequentially in one forked process keeps
		 * that cost from being paid by several workers at once. Module
		 * isolation per file is still on, so the framework singletons
		 * start clean for every suite.
		 */
		pool: 'forks',
		maxWorkers: 1,
		minWorkers: 1,
		fileParallelism: false,
		testTimeout: 30000,
		hookTimeout: 30000
	}
});
