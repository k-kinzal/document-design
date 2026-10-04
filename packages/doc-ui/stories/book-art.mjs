// Reproducible analytical artwork, not measured data. Run with
// `npm run build:book-art --workspace @k-kinzal/doc-ui`.
// PNG encoding uses only Node built-ins; reading the book needs no generator.
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const width = 1152, height = 576;
const folder = new URL('./assets/', import.meta.url);
mkdirSync(folder, { recursive: true });

function chunk(type, data) {
  const name = Buffer.from(type);
  let crc = 0xffffffff;
  for (const byte of Buffer.concat([name, data])) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  const length = Buffer.alloc(4), checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([length, name, data, checksum]);
}

for (const mode of ['color', 'monochrome']) {
  const data = Buffer.alloc((width * 3 + 1) * height);
  for (let row = 0; row < height; row++) for (let col = 0; col < width; col++) {
    const x = col / (width - 1), y = 1 - row / (height - 1);
    const p = (1 + Math.sin(4 * Math.PI * x) * Math.cos(2 * Math.PI * y)) / 2;
    // A sequential blue ramp: p = 0 is white; p = 1 is RGB(0, 72, 112).
    // The bitonal edition encodes only p >= 1/2, deliberately losing magnitude.
    const rgb = mode === 'monochrome' ? Array(3).fill(p >= 0.5 ? 0 : 255)
      : [0, 72, 112].map(channel => Math.round(255 * (1 - p) + channel * p));
    const offset = row * (width * 3 + 1) + 1 + col * 3;
    rgb.forEach((channel, index) => { data[offset + index] = channel; });
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width); header.writeUInt32BE(height, 4);
  header[8] = 8; header[9] = 2;
  writeFileSync(new URL(`probability-${mode}.png`, folder), Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header),
    chunk('IDAT', deflateSync(data)), chunk('IEND', Buffer.alloc(0)),
  ]));
}
