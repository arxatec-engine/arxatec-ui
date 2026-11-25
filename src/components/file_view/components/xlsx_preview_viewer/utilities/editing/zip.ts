import type { SpreadsheetZipEntry } from "../../types/zip";
import { SPREADSHEET_LIMITS } from "../constants";

export interface SpreadsheetZipPart {
  name: string;
  data: Uint8Array<ArrayBuffer>;
  size: number;
  method: number;
  crc: number;
}

export function spreadsheetCompressedEntry(
  buffer: ArrayBuffer,
  entry: SpreadsheetZipEntry,
): Uint8Array<ArrayBuffer> {
  const view = new DataView(buffer);
  if (
    entry.offset + 30 > buffer.byteLength ||
    view.getUint32(entry.offset, true) !== 0x04034b50
  )
    throw new Error("SPREADSHEET_PACKAGE_INVALID");
  const start =
    entry.offset +
    30 +
    view.getUint16(entry.offset + 26, true) +
    view.getUint16(entry.offset + 28, true);
  if (start + entry.compressedSize > buffer.byteLength)
    throw new Error("SPREADSHEET_PACKAGE_INVALID");
  return new Uint8Array(buffer, start, entry.compressedSize);
}

export async function spreadsheetEntryXml(
  buffer: ArrayBuffer,
  entry: SpreadsheetZipEntry,
): Promise<string> {
  const compressed = spreadsheetCompressedEntry(buffer, entry);
  const source = new ReadableStream<BufferSource>({
    start(controller) {
      controller.enqueue(compressed);
      controller.close();
    },
  });
  if (entry.method !== 0 && entry.method !== 8)
    throw new Error("SPREADSHEET_PACKAGE_UNSUPPORTED");
  const stream =
    entry.method === 8
      ? source.pipeThrough(new DecompressionStream("deflate-raw"))
      : source;
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8 * 1024 * 1024 || size > entry.size)
        throw new Error("SPREADSHEET_PACKAGE_LIMIT");
      chunks.push(decoder.decode(value, { stream: true }));
    }
    if (size !== entry.size) throw new Error("SPREADSHEET_PACKAGE_INVALID");
    chunks.push(decoder.decode());
    return chunks.join("");
  } finally {
    await reader.cancel();
  }
}

export function spreadsheetXmlPart(
  name: string,
  xml: string,
): SpreadsheetZipPart {
  const data = new TextEncoder().encode(xml);
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return {
    name,
    data,
    size: data.byteLength,
    method: 0,
    crc: (crc ^ 0xffffffff) >>> 0,
  };
}

export function writeSpreadsheetZip(
  parts: SpreadsheetZipPart[],
): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const names = parts.map((part) => encoder.encode(part.name));
  const size = parts.reduce(
    (sum, part, index) => sum + 76 + names[index].length * 2 + part.data.length,
    22,
  );
  if (size > SPREADSHEET_LIMITS.inputBytes || parts.length > 500)
    throw new Error("SPREADSHEET_PACKAGE_LIMIT");
  const bytes = new Uint8Array(size);
  const view = new DataView(bytes.buffer);
  const offsets: number[] = [];
  let offset = 0;
  parts.forEach((part, index) => {
    const name = names[index];
    offsets.push(offset);
    view.setUint32(offset, 0x04034b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 0x800, true);
    view.setUint16(offset + 8, part.method, true);
    view.setUint16(offset + 12, 0x21, true);
    view.setUint32(offset + 14, part.crc, true);
    view.setUint32(offset + 18, part.data.length, true);
    view.setUint32(offset + 22, part.size, true);
    view.setUint16(offset + 26, name.length, true);
    bytes.set(name, offset + 30);
    bytes.set(part.data, offset + 30 + name.length);
    offset += 30 + name.length + part.data.length;
  });
  const central = offset;
  parts.forEach((part, index) => {
    const name = names[index];
    view.setUint32(offset, 0x02014b50, true);
    view.setUint16(offset + 4, 20, true);
    view.setUint16(offset + 6, 20, true);
    view.setUint16(offset + 8, 0x800, true);
    view.setUint16(offset + 10, part.method, true);
    view.setUint16(offset + 14, 0x21, true);
    view.setUint32(offset + 16, part.crc, true);
    view.setUint32(offset + 20, part.data.length, true);
    view.setUint32(offset + 24, part.size, true);
    view.setUint16(offset + 28, name.length, true);
    view.setUint32(offset + 42, offsets[index], true);
    bytes.set(name, offset + 46);
    offset += 46 + name.length;
  });
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 8, parts.length, true);
  view.setUint16(offset + 10, parts.length, true);
  view.setUint32(offset + 12, offset - central, true);
  view.setUint32(offset + 16, central, true);
  return bytes;
}
