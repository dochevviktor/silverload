const bytesToBase64 = (bytes: Uint8Array | string): string => {
  let result = '',
    i;

  if (typeof bytes === 'string') {
    return null;
  }
  const l = bytes.length;

  for (i = 2; i < l; i += 3) {
    result += base64dict[bytes[i - 2] >> 2];
    result += base64dict[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64dict[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
    result += base64dict[bytes[i] & 0x3f];
  }
  if (i === l + 1) {
    result += base64dict[bytes[i - 2] >> 2];
    result += base64dict[(bytes[i - 2] & 0x03) << 4];
    result += '==';
  }

  if (i === l) {
    result += base64dict[bytes[i - 2] >> 2];
    result += base64dict[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64dict[(bytes[i - 1] & 0x0f) << 2];
    result += '=';
  }

  return result;
};

const base64dict = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+',
  '/',
];

export default bytesToBase64;
