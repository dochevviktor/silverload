import { replaceInFileSync } from 'replace-in-file';
import { devDependencies, asciiDocVariableMap } from './package.json';

const replace = (): void => {
  const from = [];
  const to = [];

  Object.entries(asciiDocVariableMap).map(([packageDependency, docVariable]) => {
    if (devDependencies[packageDependency]) {
      from.push(new RegExp(`${docVariable}.*`));
      to.push(`${docVariable} ${devDependencies[packageDependency]}`);
    }
  });

  replaceInFileSync({
    files: 'README.adoc',
    from,
    to,
  });
};

replace();
