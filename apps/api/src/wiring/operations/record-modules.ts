/**
 * Every module built on the records kit (build step 5), in module order:
 * its key (for its switch, permissions and audit), where its routes are
 * mounted, and how to build its deps, router and dashboard numbers. Adding
 * a records module is one line here plus its own folder in modules/.
 *
 *   /api/forms            Forms                                module 8
 *   /api/approvals        Approvals                            module 9
 *   /api/data-jobs        Data jobs                            module 13
 *   /api/org              Organisation                         module 15
 *   /api/devices          Devices                              module 18
 *   /api/zones            Access zones                         module 19
 *   /api/visitors         Visitors                             module 20
 *   /api/keys             Key control                          module 21
 *   /api/recruitment      Recruitment                          module 23
 *   /api/onboarding       Onboarding and exit                  module 24
 *   /api/shifts           Shifts and rosters                   module 26
 *   /api/leave            Leave                                module 27
 *   /api/performance      Performance                          module 33
 *   /api/training         Training                             module 34
 *   /api/discipline       Discipline                           module 35
 *   /api/welfare          Staff requests and welfare           module 36
 *   /api/petty-cash       Petty cash                           module 37
 *   /api/assets           Assets                               module 41
 *   /api/tasks            Tasks                                module 42
 *   /api/housekeeping     Housekeeping                         module 43
 *   /api/laundry          Laundry                              module 44
 *   /api/security         Security                             module 45
 *   /api/lost-found       Lost and found                       module 46
 *   /api/fleet            Fleet and transport                  module 47
 *   /api/knowledge        Knowledge base                       module 48
 *   /api/meetings         Meetings                             module 51
 *   /api/surveys          Surveys and polls                    module 52
 *   /api/calendar         Company calendar                     module 53
 *   /api/corporate        Corporate accounts                   module 55
 *   /api/feedback         Feedback and complaints              module 56
 *   /api/loyalty          Loyalty                              module 57
 *   /api/campaigns        Campaigns                            module 58
 *   /api/promotions       Promotions and vouchers              module 59
 *   /api/guest-requests   Guest requests                       module 60
 *   /api/kitchen          Kitchen production                   module 63
 *   /api/buffet           Buffet                               module 65
 *   /api/pricing          Prices and taxes                     module 76
 *   /api/documents        Receipts and invoices                module 78
 *   /api/cash-up          Cash-up                              module 79
 *   /api/accounting       Accounting export                    module 80
 */

import type { StaffDirectory } from "@igongo/contracts/hr-records";
import type { KpiSource } from "@igongo/contracts/reports-analytics";
import type { ActorEnv, ChangeContext, Database } from "@igongo/core";
import type { RecordsDeps } from "@igongo/records-kit";
import type { Context, Hono } from "hono";
import { accessZonesDeps, accessZonesKpis, accessZonesRouter } from "@igongo/access-zones";
import { accountingExportDeps, accountingExportKpis, accountingExportRouter } from "@igongo/accounting-export";
import { assetRegisterDeps, assetRegisterKpis, assetRegisterRouter } from "@igongo/asset-register";
import { buffetDeps, buffetKpis, buffetRouter } from "@igongo/buffet";
import { campaignsDeps, campaignsKpis, campaignsRouter } from "@igongo/campaigns";
import { cashUpDeps, cashUpKpis, cashUpRouter } from "@igongo/cash-up";
import { companyCalendarDeps, companyCalendarKpis, companyCalendarRouter } from "@igongo/company-calendar";
import { corporateAccountsDeps, corporateAccountsKpis, corporateAccountsRouter } from "@igongo/corporate-accounts";
import { dataImportExportDeps, dataImportExportKpis, dataImportExportRouter } from "@igongo/data-import-export";
import { devicesStationsDeps, devicesStationsKpis, devicesStationsRouter } from "@igongo/devices-stations";
import { disciplineDeps, disciplineKpis, disciplineRouter } from "@igongo/discipline";
import { fleetTransportDeps, fleetTransportKpis, fleetTransportRouter } from "@igongo/fleet-transport";
import { formsBuilderDeps, formsBuilderKpis, formsBuilderRouter } from "@igongo/forms-builder";
import { guestFeedbackDeps, guestFeedbackKpis, guestFeedbackRouter } from "@igongo/guest-feedback";
import { guestRequestsDeps, guestRequestsKpis, guestRequestsRouter } from "@igongo/guest-requests";
import { housekeepingDeps, housekeepingKpis, housekeepingRouter } from "@igongo/housekeeping";
import { keyControlDeps, keyControlKpis, keyControlRouter } from "@igongo/key-control";
import { kitchenDisplayDeps, kitchenDisplayKpis, kitchenDisplayRouter } from "@igongo/kitchen-display";
import { knowledgeBaseDeps, knowledgeBaseKpis, knowledgeBaseRouter } from "@igongo/knowledge-base";
import { laundryDeps, laundryKpis, laundryRouter } from "@igongo/laundry";
import { leaveDeps, leaveKpis, leaveRouter } from "@igongo/leave";
import { locationsDepartmentsDeps, locationsDepartmentsKpis, locationsDepartmentsRouter } from "@igongo/locations-departments";
import { lostFoundDeps, lostFoundKpis, lostFoundRouter } from "@igongo/lost-found";
import { loyaltyDeps, loyaltyKpis, loyaltyRouter } from "@igongo/loyalty";
import { meetingsDeps, meetingsKpis, meetingsRouter } from "@igongo/meetings";
import { onboardingExitDeps, onboardingExitKpis, onboardingExitRouter } from "@igongo/onboarding-exit";
import { performanceDeps, performanceKpis, performanceRouter } from "@igongo/performance";
import { pettyCashDeps, pettyCashKpis, pettyCashRouter } from "@igongo/petty-cash";
import { pricingTaxDeps, pricingTaxKpis, pricingTaxRouter } from "@igongo/pricing-tax";
import { promotionsVouchersDeps, promotionsVouchersKpis, promotionsVouchersRouter } from "@igongo/promotions-vouchers";
import { receiptsInvoicingDeps, receiptsInvoicingKpis, receiptsInvoicingRouter } from "@igongo/receipts-invoicing";
import { recruitmentDeps, recruitmentKpis, recruitmentRouter } from "@igongo/recruitment";
import { securityIncidentsDeps, securityIncidentsKpis, securityIncidentsRouter } from "@igongo/security-incidents";
import { shiftsRostersDeps, shiftsRostersKpis, shiftsRostersRouter } from "@igongo/shifts-rosters";
import { staffWelfareDeps, staffWelfareKpis, staffWelfareRouter } from "@igongo/staff-welfare";
import { surveysPollsDeps, surveysPollsKpis, surveysPollsRouter } from "@igongo/surveys-polls";
import { tasksDeps, tasksKpis, tasksRouter } from "@igongo/tasks";
import { trainingDeps, trainingKpis, trainingRouter } from "@igongo/training";
import { visitorManagementDeps, visitorManagementKpis, visitorManagementRouter } from "@igongo/visitor-management";
import { workflowApprovalsDeps, workflowApprovalsKpis, workflowApprovalsRouter } from "@igongo/workflow-approvals";

/** One records module, as the gateway sees it. */
export interface RecordModuleEntry {
  key: string;
  path: string;
  deps: (db: Database, change: ChangeContext, staff: StaffDirectory | null) => RecordsDeps;
  router: (deps: (c: Context<ActorEnv>) => RecordsDeps) => Hono<ActorEnv>;
  kpis: (db: Database) => KpiSource;
}

export const RECORD_MODULES: RecordModuleEntry[] = [
  { key: "forms-builder", path: "forms", deps: formsBuilderDeps, router: formsBuilderRouter, kpis: formsBuilderKpis },
  { key: "workflow-approvals", path: "approvals", deps: workflowApprovalsDeps, router: workflowApprovalsRouter, kpis: workflowApprovalsKpis },
  { key: "data-import-export", path: "data-jobs", deps: dataImportExportDeps, router: dataImportExportRouter, kpis: dataImportExportKpis },
  { key: "locations-departments", path: "org", deps: locationsDepartmentsDeps, router: locationsDepartmentsRouter, kpis: locationsDepartmentsKpis },
  { key: "devices-stations", path: "devices", deps: devicesStationsDeps, router: devicesStationsRouter, kpis: devicesStationsKpis },
  { key: "access-zones", path: "zones", deps: accessZonesDeps, router: accessZonesRouter, kpis: accessZonesKpis },
  { key: "visitor-management", path: "visitors", deps: visitorManagementDeps, router: visitorManagementRouter, kpis: visitorManagementKpis },
  { key: "key-control", path: "keys", deps: keyControlDeps, router: keyControlRouter, kpis: keyControlKpis },
  { key: "recruitment", path: "recruitment", deps: recruitmentDeps, router: recruitmentRouter, kpis: recruitmentKpis },
  { key: "onboarding-exit", path: "onboarding", deps: onboardingExitDeps, router: onboardingExitRouter, kpis: onboardingExitKpis },
  { key: "shifts-rosters", path: "shifts", deps: shiftsRostersDeps, router: shiftsRostersRouter, kpis: shiftsRostersKpis },
  { key: "leave", path: "leave", deps: leaveDeps, router: leaveRouter, kpis: leaveKpis },
  { key: "performance", path: "performance", deps: performanceDeps, router: performanceRouter, kpis: performanceKpis },
  { key: "training", path: "training", deps: trainingDeps, router: trainingRouter, kpis: trainingKpis },
  { key: "discipline", path: "discipline", deps: disciplineDeps, router: disciplineRouter, kpis: disciplineKpis },
  { key: "staff-welfare", path: "welfare", deps: staffWelfareDeps, router: staffWelfareRouter, kpis: staffWelfareKpis },
  { key: "petty-cash", path: "petty-cash", deps: pettyCashDeps, router: pettyCashRouter, kpis: pettyCashKpis },
  { key: "asset-register", path: "assets", deps: assetRegisterDeps, router: assetRegisterRouter, kpis: assetRegisterKpis },
  { key: "tasks", path: "tasks", deps: tasksDeps, router: tasksRouter, kpis: tasksKpis },
  { key: "housekeeping", path: "housekeeping", deps: housekeepingDeps, router: housekeepingRouter, kpis: housekeepingKpis },
  { key: "laundry", path: "laundry", deps: laundryDeps, router: laundryRouter, kpis: laundryKpis },
  { key: "security-incidents", path: "security", deps: securityIncidentsDeps, router: securityIncidentsRouter, kpis: securityIncidentsKpis },
  { key: "lost-found", path: "lost-found", deps: lostFoundDeps, router: lostFoundRouter, kpis: lostFoundKpis },
  { key: "fleet-transport", path: "fleet", deps: fleetTransportDeps, router: fleetTransportRouter, kpis: fleetTransportKpis },
  { key: "knowledge-base", path: "knowledge", deps: knowledgeBaseDeps, router: knowledgeBaseRouter, kpis: knowledgeBaseKpis },
  { key: "meetings", path: "meetings", deps: meetingsDeps, router: meetingsRouter, kpis: meetingsKpis },
  { key: "surveys-polls", path: "surveys", deps: surveysPollsDeps, router: surveysPollsRouter, kpis: surveysPollsKpis },
  { key: "company-calendar", path: "calendar", deps: companyCalendarDeps, router: companyCalendarRouter, kpis: companyCalendarKpis },
  { key: "corporate-accounts", path: "corporate", deps: corporateAccountsDeps, router: corporateAccountsRouter, kpis: corporateAccountsKpis },
  { key: "guest-feedback", path: "feedback", deps: guestFeedbackDeps, router: guestFeedbackRouter, kpis: guestFeedbackKpis },
  { key: "loyalty", path: "loyalty", deps: loyaltyDeps, router: loyaltyRouter, kpis: loyaltyKpis },
  { key: "campaigns", path: "campaigns", deps: campaignsDeps, router: campaignsRouter, kpis: campaignsKpis },
  { key: "promotions-vouchers", path: "promotions", deps: promotionsVouchersDeps, router: promotionsVouchersRouter, kpis: promotionsVouchersKpis },
  { key: "guest-requests", path: "guest-requests", deps: guestRequestsDeps, router: guestRequestsRouter, kpis: guestRequestsKpis },
  { key: "kitchen-display", path: "kitchen", deps: kitchenDisplayDeps, router: kitchenDisplayRouter, kpis: kitchenDisplayKpis },
  { key: "buffet", path: "buffet", deps: buffetDeps, router: buffetRouter, kpis: buffetKpis },
  { key: "pricing-tax", path: "pricing", deps: pricingTaxDeps, router: pricingTaxRouter, kpis: pricingTaxKpis },
  { key: "receipts-invoicing", path: "documents", deps: receiptsInvoicingDeps, router: receiptsInvoicingRouter, kpis: receiptsInvoicingKpis },
  { key: "cash-up", path: "cash-up", deps: cashUpDeps, router: cashUpRouter, kpis: cashUpKpis },
  { key: "accounting-export", path: "accounting", deps: accountingExportDeps, router: accountingExportRouter, kpis: accountingExportKpis },
];
