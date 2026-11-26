/**
 * A copy of [obj] without [key], such as a row without its primary key for
 * an upsert's update part, or a job without its secret code.
 * @example omitKey({ id: "a", name: "b" }, "id") // { name: "b" }
 */
export function omitKey<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key)) as Omit<T, K>;
}
