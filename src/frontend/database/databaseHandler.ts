import * as SLEvent from '../../common/class/SLEvent';
import { getSettings, saveSettings, initSettings } from '../../common/class/SLSettings';
import { deleteTabs, loadTabs, saveTabs } from '../../common/class/SLTab';

initSettings().catch((e) => console.error(e));

// SL Settings
SLEvent.SAVE_SETTINGS.sendBack((arg) => saveSettings(arg));
SLEvent.LOAD_SETTINGS.sendBack(() => getSettings());

// SL Tabs
SLEvent.SAVE_TABS.sendBack((arg) => saveTabs(arg));
SLEvent.LOAD_TABS.sendBack(() => loadTabs());
SLEvent.DELETE_TABS.on(() => deleteTabs());

SLEvent.UPDATE_SETTINGS.on((settings) => SLEvent.setGlobalSettings(settings));
