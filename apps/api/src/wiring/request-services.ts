/**
 * The composition root: builds each module's stores and services for one
 * request, on first use, all on the request's database (or transaction).
 * Modules never build each other; they get what they need from here
 * through their contracts.
 */

import type { RecordsDeps } from "@igongo/records-kit";
import { stockDeps, stockDeskDeps, type StockDeps } from "@igongo/stock-inventory";
import type { RecordModuleEntry } from "./operations/record-modules";
import { SettingsLayoutStore } from "@igongo/app-builder";
import { auditRecorder, DrizzleAuditStore } from "@igongo/audit-trail";
import { memoryBlobStore, r2BlobStore, type BlobStore } from "@igongo/files-media";
import type { AuditRecorder } from "@igongo/contracts/audit-trail";
import type { StaffAccountCheck } from "@igongo/contracts/roles-permissions";
import { createLogger, SecretBox, type ChangeContext, type Database } from "@igongo/core";
import { accessService, DrizzleAssignmentRepository, DrizzleRoleRepository } from "@igongo/roles-permissions";
import { DrizzleConsoleStore, moduleSwitchReader, secretReader } from "@igongo/super-admin";
import {
  createAuth,
  DrizzleAccountStore,
  DrizzleFailedLoginStore,
  DrizzleKnownDeviceStore,
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
import { ManagerServices } from "./managers/manager-services";
import { noticeAnnouncer } from "./staff/notice-announcer";
import { securityAlerts } from "./security-alerts";
import { userNotifier } from "./user-notifier";
import { staffRecordMatcher } from "@igongo/hr-records";
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
  /** Staff roles only go to staff accounts: Users & Login says which accounts are staff. */
  readonly staffAccounts = once((): StaffAccountCheck => ({ isStaffAccount: async (id) => (await this.accounts().get(id))?.kind === "staff" }));
  readonly access = once(() =>
    accessService({ roles: this.roles(), assignments: this.assignments(), staffAccounts: this.staffAccounts() }, { audit: this.audit(), now: this.now, requestId: this.requestId }),
  );

  // --- App Layout & Navigation (core: menus, tabs and home tiles per role) ---
  readonly layoutStore = once(() => new SettingsLayoutStore(this.db));

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
        failedLogins: new DrizzleFailedLoginStore(this.db),
        devices: new DrizzleKnownDeviceStore(this.db),
        alerts: this.securityAlerts(),
        bootstrapEmail: this.bootstrapEmail,
      }),
  );
  /** New-device and sign-in method alerts, by email (once set up) and push. */
  readonly securityAlerts = once(() => securityAlerts(notConfiguredCodeSender, this.notifier(), this.access(), this.logger()));

  /** HR's staff records for the super admin's staff match, recorded as [actor]. */
  staffRecords(actor: { userId: string; name: string } | undefined) {
    return staffRecordMatcher({ staff: this.staffModules().staff(), roles: this.access() }, this.changeContext(actor));
  }

  // --- Staff modules (HR, cards, wristbands, attendance, reports, meals, notices) ---
  readonly staffModules = once(() => new StaffServices(this.db, noticeAnnouncer(this.db, this.env, (roles) => this.access().holdersOf(roles))));

  /** Pushes to people's own phones, for orders, deliveries and chat. */
  readonly notifier = once(() => userNotifier(this.db, this.env, this.logger()));

  // --- Guests and riders (CRM, menus, orders, delivery, payments, bookings) ---
  /** The guest modules for [actor]'s change context. */
  guestModules(actor: { userId: string; name: string } | undefined): GuestServices {
    const cfg = this.config;
    return new GuestServices(this.db, this.changeContext(actor), this.modules(), this.secrets(), { api: cfg.baseURL, web: cfg.webOrigins[0] ?? cfg.baseURL }, this.notifier(), { apiKey: this.env.RESEND_API_KEY, from: this.env.RECEIPT_FROM });
  }

  // --- Managers and money (files, faults, checkups, payroll, advances, bonuses, earnings, reports, chat, records) ---
  /** Files' bytes: the R2 bucket, memory for local runs, or null (uploads say "not set up"). */
  private readonly blobs = once((): BlobStore | null => (this.env.FILES ? r2BlobStore(this.env.FILES) : this.config.environment === "development" ? memoryBlobStore() : null));
  private managers: ManagerServices | null = null;

  /** The manager modules for [actor]'s change context; one per request, so loaded deps are kept. */
  managerModules(actor: { userId: string; name: string } | undefined): ManagerServices {
    return (this.managers ??= new ManagerServices(this.db, this.changeContext(actor), this.modules(), this.staffModules(), this.blobs(), this.auditStore(), this.notifier()));
  }

  // --- Records-kit modules (operations, HR extras, guest service and money desks) ---
  /** [entry]'s deps for [actor], with the HR staff directory for assignees. */
  recordModule(entry: RecordModuleEntry, actor: { userId: string; name: string } | undefined): RecordsDeps {
    return entry.deps(this.db, this.changeContext(actor), this.staffModules().staff());
  }

  /** Stock & Inventory's ledger deps for [actor]. */
  stock(actor: { userId: string; name: string } | undefined): StockDeps {
    return stockDeps(this.db, this.changeContext(actor), this.staffModules().staff());
  }

  /** Stock's desk (requisitions, purchasing, suppliers, counts, recipes) for [actor]. */
  stockDesk(actor: { userId: string; name: string } | undefined): RecordsDeps {
    return stockDeskDeps(this.db, this.changeContext(actor), this.staffModules().staff());
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
