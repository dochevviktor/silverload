import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { rollup, InputOptions, OutputOptions } from 'rollup';
import merge from 'webpack-merge';

const devInputOptions: InputOptions = {
  plugins: [
    json({
      compact: false,
    }),
  ],
};

const prodInputOptions: InputOptions = {
  plugins: [
    json({
      compact: true,
    }),
    terser(),
  ],
};

const commonInputOptions: InputOptions = {
  input: 'src/server/main.ts',
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      resolveOnly: [new RegExp('^(?!.*(electron|url))')],
    }),
    typescript({
      tsconfig: 'src/server/tsconfig.json',
    }),
    commonjs(),
  ],
};

const outputOptions: OutputOptions = {
  file: 'dist/main.js',
  format: 'cjs',
  sourcemap: false,
};

const build = (): void => {
  const inputOptions = process.env?.production ? prodInputOptions : devInputOptions;

  rollup(merge(commonInputOptions, inputOptions)).then((bundle) =>
    bundle.generate(outputOptions).then(() => bundle.write(outputOptions))
  );
};

build();
