/** Encrypts and decrypts key values. `SecretBox` from @igongo/core in production. */

export interface Sealer {
  seal(plain: string): Promise<string>;
  open(sealed: string): Promise<string>;
}
