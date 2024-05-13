import { dirname, join } from 'node:path';
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import esbuildMinify from './esbuild';
import type EsbuildConfig from './_types/EsbuildConfig';
import oraStatus from './oraStatus';

(async () => {
	const configFile = 'esbuild.config.json';

	const esbuildConfigDefaultEntries: EsbuildConfig = {
		inputFile: 'src/index.ts',
		outFile: 'build/index.js',
	};

	if (!existsSync(configFile)) {
		console.log(`'${configFile}' not found. Creating it...`);
		writeFileSync(
			configFile,
			JSON.stringify(esbuildConfigDefaultEntries, null, '\t'),
			'utf-8',
		);
		console.log(
			`'${configFile}' created. Please fill in the required fields.`,
		);

		process.exit(0);
	}

	const esbuildConfigRaw = readFileSync(configFile, 'utf-8');
	const esbuildConfig: EsbuildConfig = JSON.parse(esbuildConfigRaw);

	const outFileBasepath = dirname(esbuildConfig.outFile);

	if (!existsSync(outFileBasepath)) {
		mkdirSync(outFileBasepath, { recursive: true });
	}

	// Remove old files from output folder
	const status_removeOldFiles = oraStatus(
		`Removing old files from '${outFileBasepath}' folder...`,
	);
	try {
		for (const file of readdirSync(outFileBasepath)) {
			rmSync(join(outFileBasepath, file), {
				recursive: true,
				force: true,
			});
		}
		status_removeOldFiles.succeed(
			`Removed old files from '${outFileBasepath}' folder`,
		);
	} catch {
		status_removeOldFiles.fail(
			`Failed to remove old files from '${outFileBasepath}' folder`,
		);
	}

	// Minify file input file
	const esbuildInputFiles = esbuildConfig.inputFile || 'src/index.ts';
	const esbuildOutFile = esbuildConfig.outFile || 'build/index.js';

	const status_minifying = oraStatus(
		`Minifying '${esbuildInputFiles}' into '${esbuildOutFile}'...`,
	);

	try {
		await esbuildMinify(esbuildInputFiles, esbuildOutFile);

		status_minifying.succeed(
			`Minified '${esbuildInputFiles}' into '${esbuildOutFile}'`,
		);
	} catch (error) {
		status_minifying.fail(
			`Failed to minify '${esbuildInputFiles}' into '${esbuildOutFile}'`,
		);
	}
})();
