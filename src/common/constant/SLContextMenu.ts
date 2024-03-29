export interface SLContextMenuData<T> {
  context: T;
  x?: number;
  y?: number;
  selectedItem?: SLContextMenu;
}

const enum SLContextMenu {
  TAB_DUPLICATE = 'Duplicate',
  TAB_REOPEN_CLOSED = 'Reopen closed tab',
  TAB_CLOSE_OTHERS = 'Close other tabs',
  TAB_CLOSE_LEFT = 'Close tabs to the right',
}

export default SLContextMenu;
