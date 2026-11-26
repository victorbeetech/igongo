/**
 * The manager and money modules' dependencies for one request (build step
 * 4): Files & Media, Faults & Maintenance, Inspections, Payroll, Advances &
 * Loans, Bonuses & Rewards, Earnings Statements, Reports & Analytics, Chat
 * and Records Search. Modules meet only through their contracts, wired here:
 *
 *   Faults, Inspections, Chat -> FileDirectory (Files & Media)
 *   Inspections               -> FaultReporter (Faults)
 *   Payroll                   -> CashBonusSource (Bonuses), AdvanceRecovery (Advances)
 *   Bonuses                   -> CardResolver (Staff Cards), for the buffet
 *   Earnings Statements       -> PayHistory, BonusHistory, AdvanceHistory
 *   Reports & Analytics       -> a KpiSource from every module with numbers
 *   Records Search            -> AuditReader (Audit Trail)
 *
 * A module the super admin switched off is left out of the others' view
 * (its contract is null, or its tiles are not asked for).
 */

import { advanceHistory, advanceKpis, advanceRecovery, DrizzleAdvanceRepository, SettingsAdvanceRulesStore, type AdvancesDeps } from "@igongo/advances-loans";
import { attendanceKpis } from "@igongo/attendance";
import { bonusHistory, bonusKpis, cashBonusSource, DrizzleBonusRepository, SettingsBonusRulesStore, type BonusesDeps } from "@igongo/bonuses-rewards";
import { chatKpis, DrizzleChatRepository, SettingsChatStore, type ChatDeps } from "@igongo/chat";
import type { AuditReader } from "@igongo/contracts/audit-trail";
import type { ModuleSwitchReader } from "@igongo/contracts/super-admin";
import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { ChangeContext, Database } from "@igongo/core";
import { craftsBookshopKpis } from "@igongo/crafts-bookshop";
import { guestKpis } from "@igongo/crm-guests";
import type { EarningsDeps } from "@igongo/earnings-statements";
import { eventsConferencesKpis } from "@igongo/events-conferences";
import { DrizzleFaultRepository, faultKpis, faultReporter, SettingsFaultStore, type FaultsDeps } from "@igongo/faults-maintenance";
import { DrizzleFileRepository, fileDirectory, SettingsFileRulesStore, type BlobStore, type FilesDeps } from "@igongo/files-media";
import { orderKpis } from "@igongo/food-ordering";
import { DrizzleInspectionRepository, inspectionKpis, SettingsInspectionStore, type InspectionsDeps } from "@igongo/inspections";
import { museumKpis } from "@igongo/museum";
import { paymentKpis } from "@igongo/payments";
import { DrizzlePayrollRepository, payHistory, payrollKpis, SettingsPayrollStore, type PayrollDeps } from "@igongo/payroll";
import { poolKpis } from "@igongo/pool";
import type { RecordsDeps } from "@igongo/records-search";
import { SettingsDashboardStore, type ReportsDeps } from "@igongo/reports-analytics";
import { roomBookingsKpis } from "@igongo/room-bookings";
import { RECORD_MODULES } from "../operations/record-modules";
import type { StaffServices } from "../staff/staff-services";

/** Every module with dashboard numbers: module key, and how to build its source. */
const KPI_SOURCES: Record<string, (db: Database) => KpiSource> = {
  attendance: attendanceKpis,
  "food-ordering": orderKpis,
  payments: paymentKpis,
  "crm-guests": guestKpis,
  "room-bookings": roomBookingsKpis,
  museum: museumKpis,
  "events-conferences": eventsConferencesKpis,
  pool: poolKpis,
  "crafts-bookshop": craftsBookshopKpis,
  "faults-maintenance": faultKpis,
  inspections: inspectionKpis,
  payroll: payrollKpis,
  "advances-loans": advanceKpis,
  "bonuses-rewards": bonusKpis,
  chat: chatKpis,
  // Every records-kit module (operations, HR extras, guest service, money desks).
  ...Object.fromEntries(RECORD_MODULES.map((m) => [m.key, m.kpis])),
};

/** The deps that need an `await` (they ask which other modules are on), loaded once per request. */
export interface PreparedDeps {
  inspections: InspectionsDeps;
  payroll: PayrollDeps;
  earnings: EarningsDeps;
  reports: ReportsDeps;
}

export class ManagerServices {
  /** What [load] has built for this request. */
  private readonly loaded: Partial<PreparedDeps> = {};

  constructor(
    private readonly db: Database,
    private readonly change: ChangeContext,
    private readonly modules: ModuleSwitchReader,
    private readonly staffModules: StaffServices,
    /** The R2 bucket for files, or null when it is not bound. */
    private readonly blobs: BlobStore | null,
    private readonly trail: AuditReader,
  ) {}

  /** Builds [key]'s deps once, before its router runs (see manager-routes.ts). */
  async load<K extends keyof PreparedDeps>(key: K): Promise<void> {
    this.loaded[key] ??= (await this[key]()) as PreparedDeps[K];
  }

  /** The deps [load] built. @throws Error when the route forgot to load them (a wiring bug) */
  ready<K extends keyof PreparedDeps>(key: K): PreparedDeps[K] {
    const deps = this.loaded[key];
    if (!deps) throw new Error(`The ${key} module's dependencies were not loaded.`);
    return deps;
  }

  /** True when the super admin has [key] on and not in maintenance. */
  private async isOn(key: string): Promise<boolean> {
    const s = await this.modules.stateOf(key);
    return s.enabled && !s.maintenance;
  }

  /** [make]'s result while module [key] is on, otherwise null. */
  private async whenOn<T>(key: string, make: () => T): Promise<T | null> {
    return (await this.isOn(key)) ? make() : null;
  }

  files(): FilesDeps {
    return { files: new DrizzleFileRepository(this.db), blobs: this.blobs, rules: new SettingsFileRulesStore(this.db), change: this.change };
  }

  private fileDirectory() {
    return fileDirectory(new DrizzleFileRepository(this.db));
  }

  faults(): FaultsDeps {
    return { faults: new DrizzleFaultRepository(this.db), settings: new SettingsFaultStore(this.db), staff: this.staffModules.staff(), files: this.fileDirectory(), change: this.change };
  }

  async inspections(): Promise<InspectionsDeps> {
    return {
      inspections: new DrizzleInspectionRepository(this.db),
      settings: new SettingsInspectionStore(this.db),
      staff: this.staffModules.staff(),
      files: this.fileDirectory(),
      faults: await this.whenOn("faults-maintenance", () => faultReporter(this.faults())),
      change: this.change,
    };
  }

  advances(): AdvancesDeps {
    return { advances: new DrizzleAdvanceRepository(this.db), rules: new SettingsAdvanceRulesStore(this.db), staff: this.staffModules.staff(), change: this.change };
  }

  bonuses(): BonusesDeps {
    return { bonuses: new DrizzleBonusRepository(this.db), rules: new SettingsBonusRulesStore(this.db), staff: this.staffModules.staff(), cards: this.staffModules.cardResolver(), change: this.change };
  }

  async payroll(): Promise<PayrollDeps> {
    return {
      payroll: new DrizzlePayrollRepository(this.db),
      settings: new SettingsPayrollStore(this.db),
      staff: this.staffModules.staff(),
      bonuses: await this.whenOn("bonuses-rewards", () => cashBonusSource(this.bonuses())),
      advances: await this.whenOn("advances-loans", () => advanceRecovery(this.advances())),
      change: this.change,
    };
  }

  async earnings(): Promise<EarningsDeps> {
    return {
      staff: this.staffModules.staff(),
      pay: await this.whenOn("payroll", () => payHistory(new DrizzlePayrollRepository(this.db))),
      bonuses: await this.whenOn("bonuses-rewards", () => bonusHistory(this.bonuses())),
      advances: await this.whenOn("advances-loans", () => advanceHistory(this.advances())),
      change: this.change,
    };
  }

  async reports(): Promise<ReportsDeps> {
    // Only switched-on modules are asked for numbers.
    const on = await Promise.all(Object.keys(KPI_SOURCES).map(async (k) => ((await this.isOn(k)) ? k : null)));
    const sources = on.filter((k): k is string => !!k).map((k) => (KPI_SOURCES[k] as (db: Database) => KpiSource)(this.db));
    return { sources, settings: new SettingsDashboardStore(this.db), change: this.change };
  }

  chat(): ChatDeps {
    return { chats: new DrizzleChatRepository(this.db), settings: new SettingsChatStore(this.db), staff: this.staffModules.staff(), files: this.fileDirectory(), change: this.change };
  }

  records(): RecordsDeps {
    return { trail: this.trail, change: this.change };
  }
}
