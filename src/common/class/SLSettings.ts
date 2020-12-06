import { Column, Entity, SLTable } from './SLTable';

export default interface SLSettings {
  title: string;
  flag?: boolean;
  value?: string;
}

@Entity
export class SLSettingsTable extends SLTable<SLSettings> implements SLSettings {
  @Column({ pk: true })
  title: string;

  @Column({ default: false })
  flag: boolean;

  @Column({ nullable: true })
  value: string;
}
