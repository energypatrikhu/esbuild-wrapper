import { build } from 'esbuild';
import { existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { EOL } from 'node:os';

const __sourceFile = './src/index.ts';
const __destinationFile = './build/index.js';
const prefix = '#! /usr/bin/env node';

console.log(`Removing '${__destinationFile}'...`);
try {
	if (existsSync(__destinationFile)) {
		rmSync(__destinationFile, { force: true, recursive: true });
	}
	console.log(`Removed '${__destinationFile}'`);
} catch (error) {
	console.error(`Failed to remove '${__destinationFile}'`);
	throw error;
}

console.log(`\nMinifying '${__sourceFile}' into '${__destinationFile}' file...`);
try {
	const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
	await build({
		entryPoints: [__sourceFile],
		platform: 'node',
		bundle: true,
		outfile: __destinationFile,
		logLevel: 'warning',
		treeShaking: true,
		minify: true,
		format: 'cjs',
		external: (() => {
			const dependencies = new Set();
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
	console.log(`Minified '${__sourceFile}' into '${__destinationFile}' file`);
} catch (error) {
	console.error(`Failed to minify '${__sourceFile}' into '${__destinationFile}' file`);
	throw error;
}

console.log('\nAdding shebang...');
try {
	writeFileSync(__destinationFile, prefix + EOL + readFileSync(__destinationFile, 'utf-8'), 'utf-8');
	console.log('Added shebang');
} catch (error) {
	console.error('Failed to add shebang');
	throw error;
}
