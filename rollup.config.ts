import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { rollup, InputOptions, OutputOptions } from 'rollup';
import merge from 'webpack-merge';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import externals from 'rollup-plugin-node-externals';

const devInputOptions: InputOptions = {
  plugins: [
    replace({
      delimiters: ['', ''],
      preventAssignment: true,
      values: {
        'exports.getRoot(exports.getFileName());': "exports.getRoot('package.json');",
        ': commonjsRequire;': ': require;',
      },
    }),
    json({
      compact: false,
    }),
  ],
};

const prodInputOptions: InputOptions = {
  plugins: [
    replace({
      delimiters: ['', ''],
      preventAssignment: true,
      values: {
        'exports.getRoot(exports.getFileName());': 'process.resourcesPath',
        ': commonjsRequire;': ': require;',
        "'build'": "'.'",
      },
    }),
    json({
      compact: true,
    }),
    terser({
      keep_classnames: true,
    }),
  ],
};

const elInputOptions: InputOptions = {
  input: 'src/electron/main.ts',
  plugins: [
    externals({
      include: ['electron'],
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      tsconfig: 'src/electron/tsconfig.json',
    }),
    commonjs(),
    copy({
      targets: [{ src: ['**/Release/*.node', '!**/*test*'], dest: 'build' }],
      verbose: true,
    }),
  ],
};

const elOutputOptions: OutputOptions = {
  file: 'build/main.js',
  format: 'cjs',
  sourcemap: false,
};

const dbInputOptions: InputOptions = {
  input: 'src/database/databaseHandler.ts',
  plugins: [
    externals({
      include: ['electron'],
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      tsconfig: 'src/database/tsconfig.json',
    }),
    commonjs(),
  ],
};

const dbOutputOptions: OutputOptions = {
  file: 'build/databaseHandler.js',
  format: 'cjs',
  sourcemap: false,
};

const fsInputOptions: InputOptions = {
  input: 'src/fs-handler/fsHandler.ts',
  plugins: [
    externals({
      include: ['electron'],
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      tsconfig: 'src/fs-handler/tsconfig.json',
    }),
    commonjs(),
  ],
};

const fsOutputOptions: OutputOptions = {
  file: 'build/fsHandler.js',
  format: 'cjs',
  sourcemap: false,
};

const preloadInputOptions: InputOptions = {
  input: 'src/preload/preload.ts',
  plugins: [
    externals({
      include: ['electron'],
      devDeps: false,
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript({
      tsconfig: 'src/preload/tsconfig.json',
    }),
    commonjs(),
    copy({
      targets: [{ src: ['**/@ffmpeg/core/dist/*'], dest: 'build' }],
      verbose: true,
    }),
  ],
};

const preloadOutputOptions: OutputOptions = {
  file: 'build/preload.js',
  format: 'cjs',
  sourcemap: false,
};

const build = (input: InputOptions, output: OutputOptions): void => {
  const inputOptions = merge(input, process.env?.production ? prodInputOptions : devInputOptions);

  rollup(inputOptions).then((bundle) => bundle.generate(output).then(() => bundle.write(output)));
};

// Build main electron process
build(elInputOptions, elOutputOptions);

// Build database handler process
build(dbInputOptions, dbOutputOptions);

// Build file system handler process
build(fsInputOptions, fsOutputOptions);

// Build preload handler process
build(preloadInputOptions, preloadOutputOptions);
