import test from 'node:test';
import assert from 'node:assert/strict';
import { deflateRawSync } from 'node:zlib';
import { isZip, readZipEntries } from '../src/zip.mjs';

// Builds a minimal zip with one entry, stored or deflated.
export function makeZip(name, content, { deflate = false } = {}) {
  const data = Buffer.from(content);
  const payload = deflate ? deflateRawSync(data) : data;
  const nameBuf = Buffer.from(name);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(deflate ? 8 : 0, 8);
  local.writeUInt32LE(0, 14);
  local.writeUInt32LE(payload.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(deflate ? 8 : 0, 10);
  central.writeUInt32LE(payload.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt32LE(0, 42);
  const centralOffset = local.length + nameBuf.length + payload.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(1, 8);
  eocd.writeUInt16LE(1, 10);
  eocd.writeUInt32LE(central.length + nameBuf.length, 12);
  eocd.writeUInt32LE(centralOffset, 16);
  return Buffer.concat([local, nameBuf, payload, central, nameBuf, eocd]);
}

test('reads stored and deflated single-file archives', () => {
  for (const deflate of [false, true]) {
    const zip = makeZip('report.manifest.json', '{"schema":1}', { deflate });
    assert.ok(isZip(zip));
    const entries = readZipEntries(zip);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].name, 'report.manifest.json');
    assert.equal(entries[0].data.toString(), '{"schema":1}');
  }
});

test('non-archives are recognised and corrupt archives are refused', () => {
  assert.equal(isZip(Buffer.from('{"raw":true}')), false);
  assert.throws(() => readZipEntries(Buffer.from('not a zip at all, definitely not')), /end of central directory/);
});
