/** `BlobStore` in memory, for tests and local runs without R2. */

import type { BlobStore } from "../../application/ports/blob-store";

export function memoryBlobStore(): BlobStore {
  const items = new Map<string, { body: Uint8Array<ArrayBuffer>; type: string }>();
  return {
    async put(key, bytes, type) {
      items.set(key, { body: bytes, type });
    },
    async get(key) {
      return items.get(key) ?? null;
    },
  };
}
