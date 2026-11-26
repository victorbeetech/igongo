/** Where file bytes are kept: Cloudflare R2 in production, memory in tests. */

export interface BlobStore {
  put(key: string, bytes: Uint8Array<ArrayBuffer>, type: string): Promise<void>;
  /** The bytes under [key], or null when missing. */
  get(key: string): Promise<{ body: ReadableStream | Uint8Array<ArrayBuffer>; type: string } | null>;
}
