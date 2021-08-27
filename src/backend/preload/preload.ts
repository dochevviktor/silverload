import { ipcRenderer } from 'electron';
import * as SLEvent from '../../common/class/SLEvent';

global.ipcRenderer = ipcRenderer;

SLEvent.UPDATE_SETTINGS.on((settings) => SLEvent.setGlobalSettings(settings));
