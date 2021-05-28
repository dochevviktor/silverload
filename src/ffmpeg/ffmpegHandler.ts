import { ipcRenderer } from 'electron';
import { spawn } from 'child_process';
import * as SLEvent from '../common/class/SLEvent';
import { SLTabImageData } from '../common/interface/SLTabImageData';

let ffmpegPath;

const commands = [
  '-i',
  '-movflags',
  'faststart',
  '-c:v',
  'libvpx-vp9',
  '-pix_fmt',
  'yuv420p',
  '-row-mt',
  '1',
  '-lossless',
  '1',
  '-vf',
  'scale=trunc(iw/2)*2:trunc(ih/2)*2',
  '-f',
  'webm',
  'pipe:1',
];

const streamToString = (imageData: SLTabImageData): void => {
  const chunks = [];

  console.log('Loading video for:', imageData);

  const tempCommands = [...commands];

  tempCommands.splice(1, 0, imageData.path);
  const ffmpeg = spawn(ffmpegPath, tempCommands, { stdio: ['ignore', 'pipe'] });

  ffmpeg.stdout.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
  ffmpeg.stdout.on('error', (err) => console.error(err.toString()));
  ffmpeg.stderr.on('data', (data) => console.log(data.toString()));
  ffmpeg.stdout.on('end', () => {
    imageData.base64 = toBase64WebM(Buffer.concat(chunks));
    imageData.type = 'video';
    SLEvent.LOAD_TAB_IMAGE.sendTo(ipcRenderer, SLEvent.GET_MAIN_WINDOW_CONTENTS_ID.sendSync(ipcRenderer), imageData);
  });
};

const toBase64WebM = (buffer: Buffer): string => `data:video/webm;base64,${buffer.toString('base64')}`;

SLEvent.LOAD_TAB_GIF_VIDEO.on(ipcRenderer, streamToString);

try {
  ffmpegPath = SLEvent.GET_FFMPEG_EXECUTABLE_PATH.sendSync(ipcRenderer);
} catch (e) {
  console.error(e);
}
