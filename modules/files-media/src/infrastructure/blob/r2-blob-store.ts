/** `BlobStore` on a Cloudflare R2 bucket (binding `FILES`). */

import type { BlobStore } from "../../application/ports/blob-store";

export function r2BlobStore(bucket: R2Bucket): BlobStore {
  return {
    async put(key, bytes, type) {
      await bucket.put(key, bytes, { httpMetadata: { contentType: type } });
    },
    async get(key) {
      const obj = await bucket.get(key);
      return obj ? { body: obj.body, type: obj.httpMetadata?.contentType ?? "application/octet-stream" } : null;
    },
  };
}
