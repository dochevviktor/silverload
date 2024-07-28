import { FFmpeg } from '@ffmpeg/ffmpeg';
import { SLTabImageData } from '../../common/interface/SLTabImageData';
import SLEvent from '../../common/class/SLEvent';
import bytesToBase64 from './constant/SLBase64Converters';

const ffmpeg = new FFmpeg();
const ffmpegQueue: SLTabImageData[] = [];
let ffmpegLock = false;

const processVideo = async (tabImageData: SLTabImageData, ffmpegCallFromQueue?: boolean) => {
  if (ffmpegLock && !ffmpegCallFromQueue) {
    ffmpegQueue.push(tabImageData);

    return;
  }

  ffmpegLock = true;

  if (!ffmpeg.loaded) {
    await ffmpeg.load({ coreURL: './ffmpeg-core.js' });
  }

  if (tabImageData?.rawFile) {
    await ffmpeg.writeFile('file.gif', tabImageData.rawFile);
    tabImageData.rawFile = null;

    ffmpeg.on('progress', (event) => {
      tabImageData.loadingProgress = Math.round(event.progress * 100.0);
      SLEvent.LOAD_TAB_GIF_VIDEO_PROGRESS.send(tabImageData);
    });

    await ffmpeg.exec([
      '-i',
      'file.gif',
      '-movflags',
      'faststart',
      '-crf',
      '23',
      '-preset',
      'ultrafast',
      '-pix_fmt',
      'yuv420p',
      '-vf',
      'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      'file.mp4',
    ]);

    const data = await ffmpeg.readFile('file.mp4', 'binary');

    tabImageData.base64 = `data:video/mp4;base64,${bytesToBase64(data)}`;

    SLEvent.LOAD_TAB_GIF_VIDEO.send(tabImageData);

    // cleanup
    await ffmpeg.deleteFile('file.mp4');
    await ffmpeg.deleteFile('file.gif');

    if (ffmpegQueue.length > 0) {
      const shift = ffmpegQueue.shift();

      await processVideo(shift, true);
    } else {
      ffmpegLock = false;
    }
  }
};

SLEvent.LOAD_TAB_GIF_VIDEO.on((tabImageData) => processVideo(tabImageData));
