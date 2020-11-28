import { replaceInFile, ReplaceInFileConfig, ReplaceResult } from 'replace-in-file';
import { readFileSync } from 'fs';

const fromList = [];
const toList = [];

const map: Map<string, string> = new Map([
  ['"electron"', ':verElectron:'],
  ['"react"', ':verReact:'],
  ['"redux"', ':verRedux:'],
  ['"typescript"', ':verTypescript:'],
  ['"sass"', ':verSass:'],
  ['"@fortawesome/react-fontawesome"', ':verFontAwesome:'],
  ['"antd"', ':verAntDesign:'],
  ['"eslint"', ':verESLint:'],
  ['"stylelint"', ':verStyleLint:'],
  ['"prettier"', ':verPrettier:'],
  ['"webpack"', ':verWebpack:'],
  ['"rollup"', ':verRollup:'],
]);

const options: ReplaceInFileConfig = {
  files: 'README.adoc',
  from: fromList,
  to: toList,
};

const loadVersionsToReplace = () => {
  const contents = readFileSync('package.json', { encoding: 'utf-8' });
  const lines = contents.split('\n').map((it) => it.trim().replace(',', ''));

  for (const [key, value] of map.entries()) {
    lines.filter((it) => it.split(' ')[0] === key).forEach(() => console.log(value));
    for (const it of lines) {
      const mapping = it.split(':');

      if (mapping[0] === key) {
        fromList.push(new RegExp(`${value}.*`));
        toList.push(value + mapping[1].replaceAll('"', ''));
        break;
      }
    }
  }
};

const replace = (): void => {
  loadVersionsToReplace();
  replaceInFile(options).then((e: ReplaceResult[]) =>
    e.filter((it) => it.hasChanged).forEach((it) => console.log(`Changed file: ${it.file}`))
  );
};

replace();
