import { join } from 'node:path';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import esbuildMinify from './esbuild';
import type EsbuildConfig from './_types/EsbuildConfig';

(async () => {
  const configFile = 'esbuild.config.json';

  const esbuildConfigDefaultEntries: EsbuildConfig = {
    inputFiles: ['src/index.ts'],
    outDir: 'build',
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

  if (!existsSync(esbuildConfig.outDir)) {
    mkdirSync(esbuildConfig.outDir, { recursive: true });
  }

  // Remove old files from output folder
  console.log(`Removing old files from '${esbuildConfig.outDir}' folder...`);
  try {
    for (const file of readdirSync(esbuildConfig.outDir)) {
      rmSync(join(esbuildConfig.outDir, file), {
        recursive: true,
        force: true,
      });
    }

    console.log(`Removed old files from '${esbuildConfig.outDir}' folder`);
  } catch (error) {
    console.error(`Failed to remove old files from '${esbuildConfig.outDir}' folder`);

    throw error;
  }

  // Minify file input file
  const esbuildInputFiles = esbuildConfig.inputFiles || ['src/index.ts'];
  const esbuildOutFile = esbuildConfig.outDir || 'build';

  console.log(`\nMinifying scripts into '${esbuildOutFile}' folder...`);
  try {
    await esbuildMinify(esbuildInputFiles, esbuildOutFile, 'options' in esbuildConfig ? esbuildConfig.options : {});

    console.log(`Minified scripts into '${esbuildOutFile}' folder`);
  } catch (error) {
    console.error(`Failed to minify scripts into '${esbuildOutFile}' folder`);

    throw error;
  }
})();

process.on('uncaughtException', (error) => {
  console.error('\n> = = = = = = = = = = < Uncaught exception > = = = = = = = = = = <');
  console.error(error);
  console.error('> = = = = = = = = = = < Uncaught exception > = = = = = = = = = = <\n');
});
