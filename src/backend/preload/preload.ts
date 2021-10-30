import { ipcRenderer } from 'electron';
import SLEvent, { setGlobalSettings } from '../../common/class/SLEvent';

global.ipcRenderer = ipcRenderer;

SLEvent.UPDATE_SETTINGS.on((settings) => setGlobalSettings(settings));
