/**
 * IDs for new records. Every table uses text IDs made here, so records keep
 * the same ID if they are ever moved between databases.
 */

/**
 * A new random ID with a short readable prefix, such as `role_3f9c...`.
 * @param prefix what kind of record it is, such as `role` or `aud`
 */
export function newId(prefix: string): string {
  // 128 random bits as hex: unique without any coordination.
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}
