import { ipcRenderer } from 'electron';
import * as SLEvent from '../common/class/SLEvent';
import { SLFile } from '../common/interface/SLFile';
import { existsSync, lstatSync, promises } from 'fs';
import { fromFile } from 'file-type';
import { basename } from 'path';
import VALID_FILE_TYPES from '../common/constant/SLImageFileTypes';
import { SLTabImageData } from '../common/interface/SLTabImageData';
import { sha1 } from 'object-hash';

window.ipcRenderer = ipcRenderer;

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

const readFileAsync = async (tabImageData: SLTabImageData): Promise<void> => {
  if (tabImageData?.path) {
    const mimeType = (await fromFile(tabImageData.path))?.mime;

    if (!validateFile(mimeType)) {
      SLEvent.LOAD_TAB_IMAGE.send(tabImageData);
    }

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

const sendSLFiles = async (args) => SLEvent.SEND_SL_FILES.send(await getSLFilesFromArgs(args));

SLEvent.LOAD_FILE_ARGUMENTS.on(sendSLFiles);
SLEvent.SEND_ADDITIONAL_FILE_ARGUMENTS.on(sendSLFiles);
SLEvent.LOAD_TAB_IMAGE.on(readFileAsync);
