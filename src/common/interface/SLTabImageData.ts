export interface SLTabImageData {
  tabId: string;
  path: string;
  base64?: string;
  base64Hash?: string;
  rawFile?: Uint8Array;
  type?: string;
}
