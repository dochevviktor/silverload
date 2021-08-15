import { SLTabImageData } from '../../common/interface/SLTabImageData';
import bytesToBase64 from './constant/SLBase64Converters';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import * as SLEvent from '../../common/class/SLEvent';

const ffmpeg = createFFmpeg({ corePath: './ffmpeg-core.js' });
const ffmpegQueue: SLTabImageData[] = [];
let ffmpegLock = false;

const processVideo = async (tabImageData: SLTabImageData, ffmpegCallFromQueue?: boolean) => {
  if (ffmpegLock && !ffmpegCallFromQueue) {
    ffmpegQueue.push(tabImageData);

    return;
  }

  ffmpegLock = true;

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  if (tabImageData?.rawFile) {
    ffmpeg.FS('writeFile', 'file.gif', tabImageData.rawFile);

    ffmpeg.setProgress(({ ratio }) => {
      tabImageData.loadingProgress = Math.round(ratio * 100.0);
      SLEvent.LOAD_TAB_GIF_VIDEO_PROGRESS.send(tabImageData);
    });

    await ffmpeg.run(
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
      'file.mp4'
    );

    const data = ffmpeg.FS('readFile', 'file.mp4');

    tabImageData.base64 = `data:video/mp4;base64,${bytesToBase64(data)}`;

    SLEvent.LOAD_TAB_GIF_VIDEO.send(tabImageData);

    // cleanup
    ffmpeg.FS('unlink', 'file.mp4');
    ffmpeg.FS('unlink', 'file.gif');

    if (ffmpegQueue.length > 0) {
      const shift = ffmpegQueue.shift();

      await processVideo(shift, true);
    } else {
      ffmpegLock = false;
    }
  }
};

SLEvent.LOAD_TAB_GIF_VIDEO.on((tabImageData) => processVideo(tabImageData));
