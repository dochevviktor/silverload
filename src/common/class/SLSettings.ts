import { Column, Entity, SLTable } from './SLTable';

export enum SLSetting {
  SAVE_ON_EXIT = 'Save tabs on application exit',
  GIF_TO_VIDEO = 'Convert GIF images to video for playback controls',
}

export default interface SLSettings {
  code: string;
  sequence: number;
  value?: string;
  flag?: boolean | number;
}

export const findSetting = (list: SLSettings[], s: SLSetting): SLSettings =>
  list.find((e) => e.code === Object.keys(SLSetting).find((it) => SLSetting[it] === s));

export const getSettings = async (): Promise<SLSettings[]> => SLSettingsTable.prototype.table.orderBy('sequence').toArray();

export const saveSettings = async (settings: SLSettings[]): Promise<SLSettings[]> => {
  if (settings && settings.length > 0) {
    await SLSettingsTable.prototype.table.bulkPut(settings);
  }

  return [];
};

export const initSettings = async (): Promise<void> => {
  const settings = await getSettings();
  const newSettings: SLSettings[] = [];

  Object.keys(SLSetting).forEach((settingCode, index) => {
    const setting = settings.find((it) => it.code === settingCode);

    if (setting) {
      setting.sequence = index;
    } else {
      newSettings.push({ code: settingCode, sequence: index, flag: false });
    }
  });
  settings.push(...newSettings);
  await saveSettings(settings);
};

@Entity
export class SLSettingsTable extends SLTable<SLSettings> implements SLSettings {
  @Column
  code: string;

  @Column
  sequence: number;
}
