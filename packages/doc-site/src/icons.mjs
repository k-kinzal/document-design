/* A compact lowercase d, drawn with the same plain typographic intent as the wordmark. */
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
const crc = bytes => {
  let n = 0xffffffff;
  for (const byte of bytes) { n ^= byte; for (let i = 0; i < 8; i++) n = (n >>> 1) ^ (0xedb88320 & -(n & 1)); }
  return (n ^ 0xffffffff) >>> 0;
};
const chunk = (type, bytes) => {
  const data = Buffer.concat([Buffer.from(type), bytes]);
  const length = Buffer.alloc(4), sum = Buffer.alloc(4);
  length.writeUInt32BE(bytes.length); sum.writeUInt32BE(crc(data));
  return Buffer.concat([length, data, sum]);
};
for (const [size, name] of [[48, 'favicon'], [180, 'apple-touch-icon']]) {
  const pixels = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    // Supersample the round bowl so the small favicon stays sharp.
    let coverage = 0;
    for (let sy = 0; sy < 4; sy++) for (let sx = 0; sx < 4; sx++) {
      const u = (x + (sx + .5) / 4) / size, v = (y + (sy + .5) / 4) / size;
      const outer = ((u - .46) / .235) ** 2 + ((v - .59) / .235) ** 2 <= 1;
      const inner = ((u - .46) / .10) ** 2 + ((v - .59) / .11) ** 2 < 1;
      const stem = u >= .595 && u <= .735 && v >= .18 && v <= .815;
      if ((outer && !inner) || stem) coverage++;
    }
    const ink = coverage / 16;
    pixels.set([252, 252, 254].map(channel => Math.round(channel * (1 - ink) + 22 * ink)), y * (size * 3 + 1) + 1 + x * 3);
  }
  const head = Buffer.alloc(13); head.writeUInt32BE(size); head.writeUInt32BE(size, 4); head[8] = 8; head[9] = 2;
  writeFileSync(new URL(`../public/assets/${name}.png`, import.meta.url), Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', head), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))]));
}
