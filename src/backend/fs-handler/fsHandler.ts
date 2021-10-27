import { ipcRenderer } from 'electron';
import { existsSync, lstatSync, promises } from 'fs';
import { basename, dirname, join } from 'path';
import { FileTypeResult, fromFile } from 'file-type';
import { sha1 } from 'object-hash';
import * as SLEvent from '../../common/class/SLEvent';
import { SLFile } from '../../common/interface/SLFile';
import VALID_FILE_TYPES from '../../common/constant/SLImageFileTypes';
import { SLTabImageData } from '../../common/interface/SLTabImageData';

global.ipcRenderer = ipcRenderer;

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
  const mimeType = (await fromFile(path))?.mime;
  const name = basename(path);

  return { name, mimeType, path };
};

const readFileAsync = async (tabImageData: SLTabImageData, fileType?: FileTypeResult): Promise<void> => {
  if (tabImageData?.path) {
    console.log('Loading file: ' + tabImageData.path);
    const mimeType = fileType != null ? fileType.mime : (await fromFile(tabImageData.path))?.mime;

    if (!validateFile(mimeType)) {
      SLEvent.LOAD_TAB_IMAGE.send(tabImageData);
    }

    tabImageData.title = basename(tabImageData.path);

    if (mimeType === 'image/gif') {
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

const getDir = async (dirPath: string) => {
  const results = [];
  const dir = await promises.readdir(dirPath, { withFileTypes: true });

  dir.forEach((it) => {
    if (it.isFile()) results.push(it.name);
  });

  return results;
};

const readFile = async (data: SLTabImageData, basePath: string, dir: string[], index: number, rev = false) => {
  if (rev) {
    dir.unshift(dir.pop());
  } else {
    dir.push(dir.shift());
  }

  const path = join(basePath, dir[index]);
  const fileType = await fromFile(path);

  if (!validateFile(fileType?.mime)) {
    return await readFile(data, basePath, dir, index, rev);
  }

  data.path = path;

  return readFileAsync(data, fileType);
};

const readNextFileAsync = async (tabImageData: SLTabImageData): Promise<void> => {
  if (tabImageData?.path) {
    const basePath = dirname(tabImageData.path);
    const dir = await getDir(basePath);
    const index = dir.indexOf(basename(tabImageData.path));

    return await readFile(tabImageData, basePath, dir, index);
  }

  SLEvent.LOAD_TAB_IMAGE.send(tabImageData);
};

const readPrevFileAsync = async (tabImageData: SLTabImageData): Promise<void> => {
  if (tabImageData?.path) {
    const basePath = dirname(tabImageData.path);
    const dir = await getDir(basePath);
    const index = dir.indexOf(basename(tabImageData.path));

    return await readFile(tabImageData, basePath, dir, index, true);
  }

  SLEvent.LOAD_TAB_IMAGE.send(tabImageData);
};

const sendSLFiles = async (args) => SLEvent.SEND_SL_FILES.send(await getSLFilesFromArgs(args));

SLEvent.LOAD_FILE_ARGUMENTS.on(sendSLFiles);
SLEvent.SEND_ADDITIONAL_FILE_ARGUMENTS.on(sendSLFiles);
SLEvent.LOAD_TAB_IMAGE.on((arg) => readFileAsync(arg));
SLEvent.LOAD_NEXT_TAB_IMAGE.on(readNextFileAsync);
SLEvent.LOAD_PREV_TAB_IMAGE.on(readPrevFileAsync);
SLEvent.UPDATE_SETTINGS.on((settings) => SLEvent.setGlobalSettings(settings));
