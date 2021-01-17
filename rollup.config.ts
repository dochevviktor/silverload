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

const commonInputOptions: InputOptions = {
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

const outputOptions: OutputOptions = {
  file: 'build/main.js',
  format: 'cjs',
  sourcemap: false,
};

const workerInputOptions: InputOptions = {
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

const workerOutputOptions: OutputOptions = {
  file: 'build/databaseHandler.js',
  format: 'cjs',
  sourcemap: false,
};

const build = (): void => {
  const inputOptions = merge(commonInputOptions, process.env?.production ? prodInputOptions : devInputOptions);
  const inputOptions2 = merge(workerInputOptions, process.env?.production ? prodInputOptions : devInputOptions);

  rollup(inputOptions).then((bundle) => bundle.generate(outputOptions).then(() => bundle.write(outputOptions)));
  rollup(inputOptions2).then((bundle) =>
    bundle.generate(workerOutputOptions).then(() => bundle.write(workerOutputOptions))
  );
};

build();
