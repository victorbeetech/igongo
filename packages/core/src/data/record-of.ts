/**
 * A record with one entry per key, typed by the keys.
 * @example recordOf(["a", "b"] as const, () => 0) // { a: 0, b: 0 }
 */
export function recordOf<K extends string, V>(keys: readonly K[], make: (key: K) => V): Record<K, V> {
  return Object.fromEntries(keys.map((k) => [k, make(k)])) as Record<K, V>;
}
