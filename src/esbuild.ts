import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import type { EsbuildMinifyOptions } from './_types/EsbuildConfig';

export default async function esbuildMinify(entrypoints: string[], destination: string, options: EsbuildMinifyOptions) {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
  const platform = 'platform' in options ? options.platform : 'node';
  const logLevel = 'logLevel' in options ? options.logLevel : 'warning';
  const treeShaking = 'treeShaking' in options ? options.treeShaking : true;
  const minify = 'minify' in options ? options.minify : true;
  const format = 'format' in options ? options.format : 'cjs';
  const outExtension = 'outExtension' in options ? options.outExtension : 'cjs';

  await build({
    entryPoints: entrypoints,
    outdir: destination,
    bundle: true,

    platform,
    logLevel,
    treeShaking,
    minify,
    format,
    outExtension: outExtension ? { '.js': `.${outExtension}` } : format === 'cjs' ? { '.js': '.cjs' } : { '.js': '.mjs' },

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
