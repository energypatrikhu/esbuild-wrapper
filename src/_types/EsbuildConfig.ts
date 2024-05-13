import type { LogLevel } from 'esbuild';

export default interface EsbuildConfig {
	inputFile: string;
	outFile: string;
	options: EsbuildMinifyOptions;
}

export interface EsbuildMinifyOptions {
	platform?: 'node' | 'browser';
	minify?: boolean;
	format?: 'cjs' | 'esm';
	logLevel?: LogLevel;
	treeShaking?: boolean;
}
