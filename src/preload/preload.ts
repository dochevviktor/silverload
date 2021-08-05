import { ipcRenderer } from 'electron';

process.once('loaded', () => (window.ipcRenderer = ipcRenderer));
