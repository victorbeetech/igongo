/** `LoginSettingsStore` on Postgres: saved switches merged over the spec defaults. */

import { LOGIN_METHODS, type LoginMethod } from "@igongo/contracts/users-login";
import type { Database } from "@igongo/core";
import type { LoginSettingsStore } from "../../application/ports/login-settings-store";
import { METHOD_INFO, type LoginMethodSetting } from "../../domain/login-method-setting";
import { DEFAULT_LOGIN_POLICY, type LoginPolicy } from "../../domain/login-policy";
import { loginMethods, loginPolicy } from "./schema";

export class DrizzleLoginSettingsStore implements LoginSettingsStore {
  constructor(private readonly db: Database) {}

  async methods(): Promise<LoginMethodSetting[]> {
    const saved = new Map((await this.db.select().from(loginMethods)).map((r) => [r.method, r]));
    // Every method appears: saved settings win, the spec defaults fill the rest.
    return LOGIN_METHODS.map((method, i) => {
      const row = saved.get(method);
      return row
        ? { method, enabled: row.enabled, allowedRoleKeys: row.allowedRoleKeys ?? null, sortOrder: row.sortOrder }
        : { method, enabled: METHOD_INFO[method].defaultOn, allowedRoleKeys: null, sortOrder: i };
    });
  }

  async method(method: LoginMethod): Promise<LoginMethodSetting> {
    return (await this.methods()).find((m) => m.method === method) as LoginMethodSetting;
  }

  async saveMethod(s: LoginMethodSetting, by: string | null): Promise<void> {
    const values = { enabled: s.enabled, allowedRoleKeys: s.allowedRoleKeys, sortOrder: s.sortOrder, updatedAt: new Date(), updatedBy: by };
    await this.db.insert(loginMethods).values({ method: s.method, ...values }).onConflictDoUpdate({ target: loginMethods.method, set: values });
  }

  async policy(): Promise<LoginPolicy> {
    const rows = await this.db.select().from(loginPolicy);
    return { ...DEFAULT_LOGIN_POLICY, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) } as LoginPolicy;
  }

  async savePolicy(patch: Partial<LoginPolicy>): Promise<void> {
    for (const [key, value] of Object.entries(patch)) {
      const row = { key, value, updatedAt: new Date() };
      await this.db.insert(loginPolicy).values(row).onConflictDoUpdate({ target: loginPolicy.key, set: { value, updatedAt: row.updatedAt } });
    }
  }
}
