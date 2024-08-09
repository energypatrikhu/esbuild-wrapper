import { build } from 'esbuild';
import { existsSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { EOL } from 'os';
import { join } from 'path';

const __sourceFile = './src/index.ts';
const __destinationDir = './build';
const prefix = '#! /usr/bin/env node';

console.log(`Removing everything from '${__destinationDir}' dir...`);
try {
  if (existsSync(__destinationDir)) {
    const files = readdirSync(__destinationDir).map((file) => join(__destinationDir, file));
    for (const file of files) {
      rmSync(file, { force: true, recursive: true });
    }
  }
  console.log(`Removed everything from '${__destinationDir}' dir`);
} catch (error) {
  console.error(`Failed to remove everything from '${__destinationDir}' dir`);
  throw error;
}

console.log(`\nMinifying '${__sourceFile}' into '${__destinationDir}' dir...`);
try {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
  await build({
    entryPoints: [__sourceFile],
    platform: 'node',
    bundle: true,
    outdir: __destinationDir,
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
  console.log(`Minified '${__sourceFile}' into '${__destinationDir}' dir`);
} catch (error) {
  console.error(`Failed to minify '${__sourceFile}' into '${__destinationDir}' dir`);
  throw error;
}

console.log('\nAdding shebang...');
try {
  writeFileSync(
    join(__destinationDir, 'index.js'),
    prefix + EOL + readFileSync(join(__destinationDir, 'index.js'), 'utf-8'),
    'utf-8',
  );
  console.log('Added shebang');
} catch (error) {
  console.error('Failed to add shebang');
  throw error;
}
