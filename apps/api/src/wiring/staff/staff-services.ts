/**
 * The staff modules' stores for one request (build step 2: HR Records,
 * Staff Cards, Wristbands, Attendance, Daily Reports, Staff Meals and the
 * Notice Board). Each is built on first use, on the request's database or
 * transaction. Modules that need another module get it only through its
 * contract: the StaffDirectory (HR Records) and the CardResolver (Staff Cards).
 */

import { DrizzleClockEventRepository, SettingsRulesStore, type AttendanceDeps } from "@igongo/attendance";
import type { ChangeContext, Database } from "@igongo/core";
import { DrizzleReportRepository, SettingsTemplateStore, type ReportsDeps } from "@igongo/daily-reports";
import { DrizzleStaffRepository } from "@igongo/hr-records";
import { DrizzleNoticeRepository, SettingsBoardStore, type NoticesDeps } from "@igongo/notice-board";
import { SettingsDesignsStore } from "@igongo/card-designs";
import { cardResolver, DrizzleCardRepository } from "@igongo/staff-cards";
import { DrizzleClaimRepository, SettingsMealRulesStore, type MealsDeps } from "@igongo/staff-meals";
import { DrizzleBandRepository } from "@igongo/wristbands";

/** Remembers the first result of [make]. */
function once<T>(make: () => T): () => T {
  let value: { v: T } | null = null;
  return () => (value ??= { v: make() }).v;
}

export class StaffServices {
  constructor(
    private readonly db: Database,
    /** Sends a new notice as a push (see notice-announcer.ts). */
    private readonly announce: NoticesDeps["announce"],
  ) {}

  /** HR Records, which is also every module's StaffDirectory. */
  readonly staff = once(() => new DrizzleStaffRepository(this.db));
  readonly cards = once(() => new DrizzleCardRepository(this.db));
  /** Staff Cards' contract for Attendance and Staff Meals. */
  readonly cardResolver = once(() => cardResolver(this.cards()));
  readonly bands = once(() => new DrizzleBandRepository(this.db));
  readonly cardDesigns = once(() => new SettingsDesignsStore(this.db));

  /** Attendance's dependencies for [change]'s caller. */
  attendance(change: ChangeContext): AttendanceDeps {
    return { events: new DrizzleClockEventRepository(this.db), rules: new SettingsRulesStore(this.db), staff: this.staff(), cards: this.cardResolver(), change };
  }

  /** Daily Reports' dependencies for [change]'s caller. */
  reports(change: ChangeContext): ReportsDeps {
    return { reports: new DrizzleReportRepository(this.db), template: new SettingsTemplateStore(this.db), staff: this.staff(), change };
  }

  /** Staff Meals' dependencies for [change]'s caller. */
  meals(change: ChangeContext): MealsDeps {
    return { claims: new DrizzleClaimRepository(this.db), rules: new SettingsMealRulesStore(this.db), staff: this.staff(), cards: this.cardResolver(), change };
  }

  /** The Notice Board's dependencies for [change]'s caller. */
  notices(change: ChangeContext): NoticesDeps {
    return { notices: new DrizzleNoticeRepository(this.db), settings: new SettingsBoardStore(this.db), change, announce: this.announce };
  }
}
