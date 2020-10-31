interface SLFileList extends FileList {
  item(index: number): SLFile | null;

  [index: number]: SLFile;
}

interface SLFile extends File {
  path?: string;
}

export default SLFileList;
