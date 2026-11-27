/**
 * Use cases for stored keys. Values go in encrypted and never come back out
 * through the API: the console sees only which keys are set and their last
 * four characters. Server code reads plain values through `SecretReader`.
 */

import type { SecretReader } from "@igongo/contracts/super-admin";
import { AppError, recordChange, type ChangeContext } from "@igongo/core";
import { isValidSecretKey, KNOWN_SECRET_KEYS } from "../../domain/secret-key";
import type { ConsoleStore } from "../ports/console-store";
import type { Sealer } from "../ports/sealer";

/** A key as the console shows it. */
export interface SecretListing {
  key: string;
  isSet: boolean;
  lastFour: string | null;
  updatedAt: Date | null;
}

/** Every known key (set or not) plus any other saved key. */
export async function listSecrets(store: ConsoleStore): Promise<SecretListing[]> {
  const saved = new Map((await store.secrets()).map((s) => [s.key, s]));
  const keys = [...new Set<string>([...KNOWN_SECRET_KEYS, ...saved.keys()])].sort();
  return keys.map((key) => {
    const s = saved.get(key);
    return { key, isSet: !!s, lastFour: s?.lastFour ?? null, updatedAt: s?.updatedAt ?? null };
  });
}

/** Encrypts and saves a key's value. */
export async function setSecret(store: ConsoleStore, sealer: Sealer, ctx: ChangeContext, key: string, value: string): Promise<void> {
  if (!isValidSecretKey(key)) throw new AppError("bad_request", "Key names look like provider.field, such as google.client_secret.");
  const trimmed = value.trim();
  if (!trimmed) throw new AppError("bad_request", "The value is empty.");
  const existed = !!(await store.secret(key));
  await store.saveSecret(key, await sealer.seal(trimmed), trimmed.slice(-4), ctx.actorId);
  // The value itself is never recorded, only that it changed.
  await recordChange(ctx, { action: "settings.secret_set", module: "super-admin", recordType: "secret", recordId: key, summary: `${existed ? "Replaced" : "Added"} the key ${key}` });
}

/** Removes a key. */
export async function deleteSecret(store: ConsoleStore, ctx: ChangeContext, key: string): Promise<void> {
  if (!(await store.deleteSecret(key))) throw new AppError("not_found", "That key is not set.");
  await recordChange(ctx, { action: "settings.secret_deleted", module: "super-admin", recordType: "secret", recordId: key, summary: `Removed the key ${key}` });
}

/** The `SecretReader` contract: plain values for server code only. */
export function secretReader(store: ConsoleStore, sealer: Sealer): SecretReader {
  return {
    async get(key) {
      const s = await store.secret(key);
      return s ? sealer.open(s.sealed) : null;
    },
    // One read of the whole (small) secrets table, then decrypt only the asked-for keys.
    // Each separate `get` is a database round trip, which costs Worker CPU on every request.
    async getMany(keys) {
      const wanted = new Set(keys);
      const rows = (await store.secrets()).filter((s) => wanted.has(s.key));
      const values = await Promise.all(rows.map(async (s) => [s.key, await sealer.open(s.sealed)] as const));
      const found = new Map<string, string>(values);
      return Object.fromEntries(keys.map((k) => [k, found.get(k) ?? null]));
    },
  };
}
