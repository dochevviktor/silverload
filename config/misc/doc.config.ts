import { replaceInFileSync } from 'replace-in-file';
import { devDependencies, dependencies } from '../../package.json';

const replace = (): void => {
  const from = [];
  const to = [];
  const asciiDocVariableMap = {
    'electron': ':verElectron:',
    'preact': ':verReact:',
    'redux': ':verRedux:',
    'typescript': ':verTypescript:',
    'sass': ':verSass:',
    '@fortawesome/react-fontawesome': ':verFontAwesome:',
    'antd': ':verAntDesign:',
    'eslint': ':verESLint:',
    'stylelint': ':verStyleLint:',
    'prettier': ':verPrettier:',
    'webpack': ':verWebpack:',
    'rollup': ':verRollup:',
    '@ffmpeg/ffmpeg': ':verFfmpeg:',
    'better-sqlite3': ':verSqlite:',
  };

  Object.entries(asciiDocVariableMap).map(([packageDependency, docVariable]) => {
    if (devDependencies[packageDependency]) {
      from.push(new RegExp(`${docVariable}.*`));
      to.push(`${docVariable} ${devDependencies[packageDependency]}`);
    }

    if (dependencies[packageDependency]) {
      from.push(new RegExp(`${docVariable}.*`));
      to.push(`${docVariable} ${dependencies[packageDependency]}`);
    }
  });

  replaceInFileSync({
    files: 'README.adoc',
    from,
    to,
  });
};

replace();
