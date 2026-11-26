/**
 * Shared helpers for the provider adapters: read the keys a provider needs
 * (failing with a clear "not set up" message), and call its JSON API.
 */

import type { SecretReader } from "@igongo/contracts/super-admin";
import { AppError } from "@igongo/core";

/** The `fetch` the adapters use (the Worker's, or a fake in tests). */
export type Fetch = (input: string, init?: RequestInit) => Promise<Response>;

/**
 * The values of [names] for [provider].
 * @throws AppError not_configured naming the missing keys, so the super admin knows what to paste
 */
export async function keysFor<K extends string>(secrets: SecretReader, provider: string, names: readonly K[]): Promise<Record<K, string>> {
  const values = await Promise.all(names.map((n) => secrets.get(n)));
  const missing = names.filter((_, i) => !values[i]);
  if (missing.length) throw new AppError("not_configured", `${provider} is not set up yet. The super admin adds ${missing.join(", ")} in Integrations.`);
  return Object.fromEntries(names.map((n, i) => [n, values[i]])) as Record<K, string>;
}

/** True when every key in [names] is saved (the provider is connected); never shows the values. */
export async function hasKeys(secrets: SecretReader, names: readonly string[]): Promise<boolean> {
  return (await Promise.all(names.map((n) => secrets.get(n)))).every(Boolean);
}

/**
 * Calls a provider and reads its JSON reply.
 * @throws AppError when the provider refuses or cannot be reached
 */
export async function callJson(fetchFn: Fetch, provider: string, url: string, init: RequestInit): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetchFn(url, init);
  } catch {
    throw new AppError("internal_error", `${provider} could not be reached. Please try again.`);
  }
  const text = await res.text();
  if (!res.ok) throw new AppError("bad_request", `${provider} refused the payment (${res.status}).`);
  return text ? (JSON.parse(text) as Record<string, unknown>) : {};
}

/** Reads a nested field, such as `at(json, "data", "status")`. */
export function at(json: unknown, ...path: string[]): unknown {
  return path.reduce<unknown>((v, k) => (v && typeof v === "object" ? (v as Record<string, unknown>)[k] : undefined), json);
}
