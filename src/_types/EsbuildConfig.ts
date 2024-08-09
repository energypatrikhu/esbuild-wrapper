import type { LogLevel } from 'esbuild';

export default interface EsbuildConfig {
  inputFiles: string[];
  outDir: string;
  options: EsbuildMinifyOptions;
}

export interface EsbuildMinifyOptions {
  platform?: 'node' | 'browser';
  minify?: boolean;
  format?: 'cjs' | 'esm';
  logLevel?: LogLevel;
  treeShaking?: boolean;
}
