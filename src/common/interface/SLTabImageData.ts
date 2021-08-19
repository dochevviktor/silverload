export interface SLTabImageData {
  tabId: string;
  path: string;
  title?: string;
  base64?: string;
  base64Hash?: string;
  rawFile?: Uint8Array;
  loadingProgress?: number;
  type?: string;
}
