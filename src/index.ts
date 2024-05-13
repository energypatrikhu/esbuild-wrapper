import { dirname, join } from 'node:path';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import esbuildMinify from './esbuild';
import type EsbuildConfig from './_types/EsbuildConfig';

(async () => {
	const configFile = 'esbuild.config.json';

	const esbuildConfigDefaultEntries: EsbuildConfig = {
		inputFile: 'src/index.ts',
		outFile: 'build/index.js',
		options: {
			platform: 'node',
			logLevel: 'warning',
			treeShaking: true,
			minify: true,
			format: 'cjs',
		},
	};

	if (!existsSync(configFile)) {
		console.log(`'${configFile}' not found. Creating it...`);
		writeFileSync(configFile, JSON.stringify(esbuildConfigDefaultEntries, null, '\t'), 'utf-8');
		console.log(`'${configFile}' created. Please fill in the required fields.`);

		process.exit(0);
	}

	const esbuildConfigRaw = readFileSync(configFile, 'utf-8');
	const esbuildConfig: EsbuildConfig = JSON.parse(esbuildConfigRaw);

	const outFileBasepath = dirname(esbuildConfig.outFile);

	if (!existsSync(outFileBasepath)) {
		mkdirSync(outFileBasepath, { recursive: true });
	}

	// Remove old files from output folder
	console.log(`Removing old files from '${outFileBasepath}' folder...`);
	try {
		for (const file of readdirSync(outFileBasepath)) {
			rmSync(join(outFileBasepath, file), {
				recursive: true,
				force: true,
			});
		}

		console.log(`Removed old files from '${outFileBasepath}' folder`);
	} catch (error) {
		console.error(`Failed to remove old files from '${outFileBasepath}' folder`);

		throw error;
	}

	// Minify file input file
	const esbuildInputFiles = esbuildConfig.inputFile || 'src/index.ts';
	const esbuildOutFile = esbuildConfig.outFile || 'build/index.js';

	console.log(`\nMinifying '${esbuildInputFiles}' into '${esbuildOutFile}'...`);
	try {
		await esbuildMinify(esbuildInputFiles, esbuildOutFile, 'options' in esbuildConfig ? esbuildConfig.options : {});

		console.log(`Minified '${esbuildInputFiles}' into '${esbuildOutFile}'`);
	} catch (error) {
		console.error(`Failed to minify '${esbuildInputFiles}' into '${esbuildOutFile}'`);

		throw error;
	}
})();

process.on('uncaughtException', (error) => {
	console.error('\n> = = = = = = = = = = < Uncaught exception > = = = = = = = = = = <');
	console.error(error);
	console.error('> = = = = = = = = = = < Uncaught exception > = = = = = = = = = = <\n');
});
