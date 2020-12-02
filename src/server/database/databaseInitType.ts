export interface DatabaseInitType {
  tables: Table[];
}

export interface Table {
  name: string;
  definitions: Definition[];
}

export interface Definition {
  name: string;
  type: string;
  pk?: boolean;
  nullable?: boolean;
  default?: number;
}
