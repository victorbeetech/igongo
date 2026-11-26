/**
 * A copy of [obj] without [key], such as a row without its primary key for
 * an upsert's update part, or a job without its secret code.
 * @example omitKey({ id: "a", name: "b" }, "id") // { name: "b" }
 */
export function omitKey<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key)) as Omit<T, K>;
}

/**
 * A copy of [obj] without any of [keys], such as a row without its ID,
 * number and creation time for an upsert's update part.
 * @example omitKeys({ id: "a", number: "N-1", name: "b" }, "id", "number") // { name: "b" }
 */
export function omitKeys<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k as K))) as Omit<T, K>;
}
