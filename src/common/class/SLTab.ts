import { Column, Entity, SLTable } from './SLTable';

export default interface SLTab {
  id: string;
  title: string;
  base64Image?: string;
  translateX?: number;
  translateY?: number;
  scaleX?: number;
  scaleY?: number;
}

@Entity
export class SLTabTable extends SLTable<SLTab> implements SLTab {
  @Column({ pk: true })
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  base64Image: string;

  @Column({ default: 0 })
  translateX: number;

  @Column({ default: 0 })
  translateY: number;

  @Column({ default: 1 })
  scaleX: number;

  @Column({ default: 1 })
  scaleY: number;
}
