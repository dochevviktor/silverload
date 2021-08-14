import { Compiler } from 'webpack';
import { ChildProcess, exec } from 'child_process';

export default class ElectronDevPlugin {
  apply(compiler: Compiler): void {
    let electronProcess: ChildProcess = null;

    compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
      if (!electronProcess) {
        electronProcess = exec('yarn run electron:run');
        electronProcess.stdout.on('data', (data) => console.log(data.toString()));
        electronProcess.stderr.on('data', (data) => console.log(data.toString()));
        electronProcess.on('exit', () => process.exit(0));
      }
    });
  }
}
