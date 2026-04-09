async function readAllBytes(readable: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  return new Uint8Array(await new Response(readable).arrayBuffer());
}

export async function compressFragment(data: object): Promise<string> {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);

  const cs = new CompressionStream('deflate-raw');
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const compressed = await readAllBytes(cs.readable);
  const base64 = btoa(String.fromCharCode(...compressed));

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Keys that would let a malicious fragment poison a target object's
// prototype chain when later merged via Object.assign / property writes.
// JSON.parse exposes them as own enumerable data properties, so we strip
// them at parse time via the reviver — recursively across the whole tree.
const FORBIDDEN_FRAGMENT_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function stripPrototypeKeys(key: string, value: unknown): unknown {
  if (FORBIDDEN_FRAGMENT_KEYS.has(key)) {
    return undefined;
  }

  return value;
}

export async function decompressFragment(encoded: string): Promise<object> {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

  const ds = new DecompressionStream('deflate-raw');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const decompressed = await readAllBytes(ds.readable);
  const json = new TextDecoder().decode(decompressed);

  return JSON.parse(json, stripPrototypeKeys);
}
