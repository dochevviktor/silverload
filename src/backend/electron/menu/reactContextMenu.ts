import { BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';
import SLContextMenu from '../../../common/constant/SLContextMenu';
import SLEvent from '../../../common/class/SLEvent';

const getMenuOption = (context: string, selectedItem: SLContextMenu): MenuItemConstructorOptions => {
  return {
    label: selectedItem,
    click: () => SLEvent.TAB_CTX_MENU.sendMain({ context, selectedItem }),
  };
};

export const reactTabContext = (context: string): MenuItemConstructorOptions[] => {
  return [
    getMenuOption(context, SLContextMenu.TAB_DUPLICATE),
    getMenuOption(context, SLContextMenu.TAB_REOPEN_CLOSED),
    { type: 'separator' },
    getMenuOption(context, SLContextMenu.TAB_CLOSE_OTHERS),
    getMenuOption(context, SLContextMenu.TAB_CLOSE_LEFT),
  ];
};

export const reactContext = (win: BrowserWindow, x: number, y: number, extra?: MenuItemConstructorOptions[]): void => {
  console.log('Call to context menu at X:', x, ' Y:', y);
  const template: MenuItemConstructorOptions[] = [];

  if (extra) {
    template.push(...extra);
  }

  if (process.env.ELECTRON_START_URL) {
    if (template.length > 0) {
      template.push({ type: 'separator' });
    }
    template.push({ label: 'Reload', click: () => win.reload() });
    template.push({ label: 'Inspect element', click: () => win.webContents.inspectElement(x, y) });
  }

  template.length > 0 && Menu.buildFromTemplate(template).popup({ window: win });
};
