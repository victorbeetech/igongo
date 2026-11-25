/**
 * Encrypts and decrypts stored secrets (gateway API keys, sign-in provider
 * keys) with AES-256-GCM. The 32-byte master key is a Cloudflare Worker
 * secret (`SETTINGS_ENCRYPTION_KEY`, base64), never in the database or code,
 * so a copy of the database alone reveals nothing.
 *
 * Stored form: `v1.<iv base64>.<ciphertext base64>`. The version lets us
 * rotate the scheme later without breaking old rows.
 */

import { AppError } from "../errors/app-error";
import { fromBase64, toBase64 } from "./base64";

/** Encrypts and decrypts with one master key. */
export class SecretBox {
  private constructor(private readonly key: CryptoKey) {}

  /**
   * Imports the master key.
   * @param base64Key 32 random bytes as base64
   * @throws AppError `not_configured` when the key is missing or the wrong size
   */
  static async fromBase64Key(base64Key: string | undefined): Promise<SecretBox> {
    const raw = base64Key ? fromBase64(base64Key) : new Uint8Array();
    if (raw.length !== 32) throw new AppError("not_configured", "The settings encryption key is not set.");
    const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
    return new SecretBox(key);
  }

  /** Encrypts [plain] with a fresh random 12-byte IV. */
  async seal(plain: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, this.key, new TextEncoder().encode(plain));
    return `v1.${toBase64(iv)}.${toBase64(new Uint8Array(cipher))}`;
  }

  /**
   * Decrypts a value made by [seal].
   * @throws Error when the value was changed or made with another key (GCM checks this)
   */
  async open(sealed: string): Promise<string> {
    const [version, iv, cipher] = sealed.split(".");
    if (version !== "v1" || !iv || !cipher) throw new Error("Unknown sealed secret format");
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(iv) }, this.key, fromBase64(cipher));
    return new TextDecoder().decode(plain);
  }
}
