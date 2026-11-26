/**
 * The composition root: builds each module's stores and services for one
 * request, on first use, all on the request's database (or transaction).
 * Modules never build each other; they get what they need from here
 * through their contracts.
 */

import { auditRecorder, DrizzleAuditStore } from "@igongo/audit-trail";
import type { AuditRecorder } from "@igongo/contracts/audit-trail";
import { createLogger, SecretBox, type ChangeContext, type Database } from "@igongo/core";
import { accessService, DrizzleAssignmentRepository, DrizzleRoleRepository } from "@igongo/roles-permissions";
import { DrizzleConsoleStore, moduleSwitchReader, secretReader } from "@igongo/super-admin";
import {
  createAuth,
  DrizzleAccountStore,
  DrizzleLoginSettingsStore,
  DrizzlePinStore,
  notConfiguredCardDirectory,
  notConfiguredCodeSender,
  type Auth,
} from "@igongo/users-login";
import type { Env } from "../shell/env";
import { readConfig } from "../shell/env";
import { authConfigFrom } from "./auth-config";
import { GuestServices } from "./guests/guest-services";
import { noticeAnnouncer } from "./staff/notice-announcer";
import { StaffServices } from "./staff/staff-services";

/** Remembers the first result of [make]. */
function once<T>(make: () => T): () => T {
  let value: { v: T } | null = null;
  return () => (value ??= { v: make() }).v;
}

export class RequestServices {
  constructor(
    private readonly db: Database,
    private readonly env: Env,
    readonly requestId: string,
    readonly now: Date = new Date(),
  ) {}

  readonly logger = once(() => createLogger({ requestId: this.requestId }));

  // --- Audit Trail ---
  readonly auditStore = once(() => new DrizzleAuditStore(this.db));
  readonly audit = once((): AuditRecorder => auditRecorder(this.auditStore()));

  // --- Roles & Permissions ---
  readonly roles = once(() => new DrizzleRoleRepository(this.db));
  readonly assignments = once(() => new DrizzleAssignmentRepository(this.db));
  readonly access = once(() => accessService({ roles: this.roles(), assignments: this.assignments() }, { audit: this.audit(), now: this.now, requestId: this.requestId }));

  // --- Super Admin Console ---
  readonly console = once(() => new DrizzleConsoleStore(this.db));
  readonly sealer = once(() => SecretBox.fromBase64Key(this.env.SETTINGS_ENCRYPTION_KEY));
  readonly modules = once(() => moduleSwitchReader(this.console()));
  /** Stored keys; null values when the encryption key is missing. */
  readonly secrets = once(() => ({
    get: async (key: string) => {
      try {
        return await secretReader(this.console(), await this.sealer()).get(key);
      } catch {
        return null;
      }
    },
  }));

  // --- Users & Login ---
  readonly accounts = once(() => new DrizzleAccountStore(this.db));
  readonly loginSettings = once(() => new DrizzleLoginSettingsStore(this.db));
  readonly auth = once(
    async (): Promise<Auth> =>
      createAuth(await authConfigFrom(this.env, this.secrets()), {
        db: this.db,
        settings: this.loginSettings(),
        accounts: this.accounts(),
        access: this.access(),
        pins: new DrizzlePinStore(this.db),
        cards: notConfiguredCardDirectory,
        codes: notConfiguredCodeSender,
        audit: this.audit(),
      }),
  );

  // --- Staff modules (HR, cards, wristbands, attendance, reports, meals, notices) ---
  readonly staffModules = once(() => new StaffServices(this.db, noticeAnnouncer(this.db, this.env, (roles) => this.access().holdersOf(roles))));

  // --- Guests and riders (CRM, menus, orders, delivery, payments, bookings) ---
  /** The guest modules for [actor]'s change context. */
  guestModules(actor: { userId: string; name: string } | undefined): GuestServices {
    const cfg = this.config;
    return new GuestServices(this.db, this.changeContext(actor), this.modules(), this.secrets(), { api: cfg.baseURL, web: cfg.webOrigins[0] ?? cfg.baseURL });
  }

  /** The change context for the signed-in caller, for audited use cases. */
  changeContext(actor: { userId: string; name: string } | undefined): ChangeContext {
    return { actorId: actor?.userId ?? null, ...(actor ? { actorName: actor.name } : {}), audit: this.audit(), now: this.now, requestId: this.requestId };
  }

  /** The owner's email for the first set-up. */
  get bootstrapEmail(): string | undefined {
    return this.env.BOOTSTRAP_ADMIN_EMAIL;
  }

  /** The checked environment. */
  get config() {
    return readConfig(this.env);
  }
}
