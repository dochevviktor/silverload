import { replaceInFileSync } from 'replace-in-file';
import { devDependencies, asciiDocVariableMap, dependencies } from './package.json';

const replace = (): void => {
  const from = [];
  const to = [];

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
