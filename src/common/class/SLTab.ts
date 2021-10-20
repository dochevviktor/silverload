import { Column, Entity, SLTable } from './SLTable';

export default interface SLTab {
  id: string;
  title: string;
  sequence?: number;
  path?: string;
  base64?: string;
  base64Hash?: string;
  translateX?: number;
  translateY?: number;
  scaleX?: number;
  scaleY?: number;
  isLoading?: boolean;
  loadingProgress?: number;
  isDragging?: boolean;
  isPaused?: boolean;
  currentTime?: number;
  shiftLeft?: boolean;
  shiftRight?: boolean;
  type?: string;
}

export const loadTabs = async (): Promise<SLTab[]> => SLTabTable.prototype.table.orderBy('sequence').toArray();

export const saveTabs = async (tabs: SLTab[]): Promise<SLTab[]> => {
  if (tabs && tabs.length > 0) {
    await SLTabTable.prototype.table.bulkPut(tabs);
  }

  return [];
};

export const deleteTabs = async (): Promise<void> => SLTabTable.prototype.table.clear();

@Entity
export class SLTabTable extends SLTable<SLTab> implements SLTab {
  @Column
  id: string;

  @Column
  title: string;

  @Column
  sequence: number;

  @Column
  path: string;

  @Column
  type: string;

  @Column
  base64Hash: string;
}
