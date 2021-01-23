const validFileTypes = [
  'image/apng',
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/bmp',
  'image/x-icon',
  // for cases where the browser cannot
  // resolve the mime type, we fall back to the
  // FS Handler (backend) to resolve it instead
  '',
];

export default validFileTypes;
