import { ipcRenderer } from 'electron';
import { Dirent, existsSync, lstatSync, promises } from 'fs';
import { basename, dirname, join } from 'path';
import * as fs from 'fs';
import { FileTypeResult, fileTypeFromFile } from 'file-type';
import { sha1 } from 'object-hash';
import SLEvent, { findGlobalSettings, setGlobalSettings } from '../../common/class/SLEvent';

import { SLFile } from '../../common/interface/SLFile';
import VALID_FILE_TYPES from '../../common/constant/SLImageFileTypes';
import { SLTabImageData } from '../../common/interface/SLTabImageData';
import { SLSetting } from '../../common/class/SLSettings';

global.ipcRenderer = ipcRenderer;

interface FileData {
  name: string;
  time: number;
}

const dirEntries = new Map<string, FileData[]>();

const validateFile = (type: string) => VALID_FILE_TYPES.indexOf(type) !== -1;

const getSLFilesFromArgs = (argList: string[]): Promise<SLFile[]> => {
  console.log('Get SLFiles From Application args: ', argList);
  const resultPromiseList = argList
    .slice(1) // first element is always the process itself - skip it
    .filter((it) => existsSync(it) && lstatSync(it).isFile())
    .map((path) => readSLFile(path));

  return Promise.all(resultPromiseList);
};

const readSLFile = async (path: string): Promise<SLFile> => {
  console.log('Loading file: ' + path);
  const mimeType = (await fileTypeFromFile(path))?.mime;
  const name = basename(path);

  return { name, mimeType, path };
};

const loadTabImage = async (tabImageData: SLTabImageData, fileType?: FileTypeResult): Promise<void> => {
  if (tabImageData?.path) {
    console.log('Loading tab image from: ' + tabImageData.path);
    const mimeType = fileType != null ? fileType.mime : (await fileTypeFromFile(tabImageData.path))?.mime;

    if (!validateFile(mimeType)) {
      SLEvent.LOAD_TAB_IMAGE.send(tabImageData);
    }

    tabImageData.title = basename(tabImageData.path);

    if (mimeType === 'image/gif' && findGlobalSettings(SLSetting.GIF_TO_VIDEO)?.flag) {
      tabImageData.rawFile = await promises.readFile(tabImageData.path);
      tabImageData.base64Hash = sha1(tabImageData.rawFile);
      tabImageData.type = 'video';
      SLEvent.LOAD_TAB_GIF_VIDEO.send(tabImageData);

      return;
    }
    const base64 = await promises.readFile(tabImageData.path, { encoding: 'base64' });

    tabImageData.base64 = `data:${mimeType};base64,${base64}`;
    tabImageData.base64Hash = sha1(tabImageData.base64);
    tabImageData.type = 'image';
  }

  SLEvent.LOAD_TAB_IMAGE.send(tabImageData);
};

const sortByName = (a: FileData, b: FileData) => ('' + a.name).localeCompare(b.name);
const sortByDate = (a: FileData, b: FileData) => a.time - b.time;

const getDir = async (dirPath: string, sort: (a: FileData, b: FileData) => number) => {
  const dir = await promises.readdir(dirPath, { withFileTypes: true });

  if (dirEntries.has(dirPath + sort.name)) {
    const cachedDir = dirEntries.get(dirPath + sort.name);

    if (cachedDir) {
      return cachedDir.map((it) => it.name);
    }
  }

  const currentDir: FileData[] = [];

  for (const dirent of dir) {
    if (dirent.isFile()) {
      const fileType = direntToFileData(dirPath, dirent);
      const mimeType = (await fileTypeFromFile(dirPath + '/' + fileType.name))?.mime;

      if (validateFile(mimeType)) {
        currentDir.push(fileType);
      }
    }
  }
  currentDir.sort(sort);
  dirEntries.set(dirPath + sort.name, currentDir);

  return currentDir.map((it) => it.name);
};

const direntToFileData = (dirPath: string, dir: Dirent): FileData => ({
  name: dir.name,
  time: fs.statSync(dirPath + '/' + dir.name).mtime.getTime(),
});

const readFile = async (data: SLTabImageData, basePath: string, dir: string[], index: number, rev = false) => {
  if (rev) {
    dir.unshift(dir.pop());
  } else {
    dir.push(dir.shift());
  }

  const path = join(basePath, dir[index]);
  const fileType = await fileTypeFromFile(path);

  if (!validateFile(fileType?.mime)) {
    return await readFile(data, basePath, dir, index, rev);
  }

  data.path = path;

  return loadTabImage(data, fileType);
};

const readFileAsync = async (tabImageData: SLTabImageData, rev = false, dateSort = false): Promise<void> => {
  if (tabImageData?.path) {
    const basePath = dirname(tabImageData.path);
    const dir = dateSort ? await getDir(basePath, sortByDate) : await getDir(basePath, sortByName);
    const index = dir.indexOf(basename(tabImageData.path));

    return await readFile(tabImageData, basePath, dir, index, rev);
  }

  SLEvent.LOAD_TAB_IMAGE.send(tabImageData);
};

const sendSLFiles = async (args) => SLEvent.SEND_SL_FILES.send(await getSLFilesFromArgs(args));

SLEvent.LOAD_FILE_ARGUMENTS.on(sendSLFiles);
SLEvent.SEND_ADDITIONAL_FILE_ARGUMENTS.on(sendSLFiles);
SLEvent.LOAD_TAB_IMAGE.on((arg) => loadTabImage(arg));
SLEvent.LOAD_NEXT_TAB_IMAGE.on((arg) => readFileAsync(arg));
SLEvent.LOAD_PREV_TAB_IMAGE.on((arg) => readFileAsync(arg, true));
SLEvent.LOAD_NEXT_TAB_DATE_IMAGE.on((arg) => readFileAsync(arg, false, true));
SLEvent.LOAD_PREV_TAB_DATE_IMAGE.on((arg) => readFileAsync(arg, true, true));
SLEvent.UPDATE_SETTINGS.on((settings) => setGlobalSettings(settings));
