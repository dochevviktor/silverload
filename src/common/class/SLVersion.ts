import { Column, Entity, SLTable } from './SLTable';

export default interface SLVersion {
  tableName: string;
  tableHash: string;
}

@Entity
export class SLVersionTable extends SLTable<SLVersion> implements SLVersion {
  @Column({ pk: true })
  tableName: string;

  @Column()
  tableHash: string;
}
