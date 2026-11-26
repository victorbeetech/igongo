/** One uploaded file's record. The bytes live in the blob store under [key]. */

export interface StoredFile {
  id: string;
  name: string;
  /** MIME type, such as `image/jpeg`. */
  type: string;
  /** Size in bytes. */
  size: number;
  /** Where the bytes are in the blob store (R2). */
  key: string;
  /** The module the file belongs to, such as `faults-maintenance`; it decides who may see it. */
  purpose: string;
  uploadedBy: string;
  uploaderName: string;
  createdAt: Date;
  /** Removed files stay recorded (permanent records); only their link stops working. */
  removedAt: Date | null;
}
