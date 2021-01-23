import { ipcRenderer } from 'electron';
import { SLEvent } from '../common/constant/SLEvent';
import { SLFile } from '../common/interface/SLFile';
import { existsSync, lstatSync, readFileSync, promises } from 'fs';
import { fromFile } from 'file-type';
import { basename } from 'path';
import VALID_FILE_TYPES from '../common/constant/SLImageFileTypes';
import { SLTabImageData } from '../common/interface/SLTabImageData';

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
  const base64 = readFileSync(path, { encoding: 'base64' });
  const name = basename(path);

  return { name, base64: `data:${mimeType};base64,${base64}`, mimeType, path };
};

const sendSLFiles = async (webContentsId, args) => {
  ipcRenderer.sendTo(webContentsId, SLEvent.SENT_FILE_ARGUMENTS, await getSLFilesFromArgs(args));
};

ipcRenderer.on(SLEvent.GET_FILE_ARGUMENTS, async (event) =>
  sendSLFiles(event.senderId, ipcRenderer.sendSync(SLEvent.GET_FILE_ARGUMENTS))
);

ipcRenderer.on(SLEvent.GET_ADDITIONAL_FILE_ARGUMENTS, async (event, args) =>
  sendSLFiles(ipcRenderer.sendSync(SLEvent.GET_MAIN_WINDOW_CONTENTS_ID), args)
);

ipcRenderer.on(SLEvent.LOAD_TAB_IMAGE, async (event, tabImageData: SLTabImageData) => {
  if (tabImageData?.path) {
    const mimeType = (await fromFile(tabImageData.path))?.mime;

    if (!validateFile(mimeType)) return;
    const base64 = await promises.readFile(tabImageData.path, { encoding: 'base64' });

    tabImageData.base64 = `data:${mimeType};base64,${base64}`;
  }
  ipcRenderer.sendTo(event.senderId, SLEvent.LOAD_TAB_IMAGE, tabImageData);
});
