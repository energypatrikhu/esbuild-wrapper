import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import type { EsbuildMinifyOptions } from './_types/EsbuildConfig';

export default async function esbuildMinify(entrypoint: string, destination: string, options: EsbuildMinifyOptions) {
	const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

	await build({
		entryPoints: [entrypoint],
		outfile: destination,
		bundle: true,

		platform: 'platform' in options ? options.platform : 'node',
		logLevel: 'logLevel' in options ? options.logLevel : 'warning',
		treeShaking: 'treeShaking' in options ? options.treeShaking : true,
		minify: 'minify' in options ? options.minify : true,
		format: 'format' in options ? options.format : 'cjs',

		external: ((): string[] => {
			const dependencies = new Set<string>();
			for (const key in packageJson) {
				if (key.toLowerCase().endsWith('dependencies')) {
					for (const dep in packageJson[key]) {
						dependencies.add(dep);
					}
				}
			}
			return [...dependencies.values()];
		})(),
	});
}
