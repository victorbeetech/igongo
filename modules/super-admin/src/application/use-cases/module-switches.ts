/**
 * Use cases for module switches: list every module with its state, and turn
 * one on, off or into maintenance. Core modules cannot be switched off.
 */

import catalog from "@igongo/contracts/catalog/modules.json";
import { ALWAYS_ON_MODULES, type ModuleState, type ModuleSwitchReader } from "@igongo/contracts/super-admin";
import { AppError, recordChange, type ChangeContext } from "@igongo/core";
import type { ModuleRow } from "../../domain/module-state";
import type { ConsoleStore } from "../ports/console-store";

const alwaysOn = new Set<string>(ALWAYS_ON_MODULES);

/** All 84 modules with their current state. */
export async function listModules(store: ConsoleStore): Promise<ModuleRow[]> {
  const saved = new Map((await store.switches()).map((s) => [s.moduleKey, s]));
  return catalog.map((m) => ({
    ...(saved.get(m.key) ?? { moduleKey: m.key, enabled: true, maintenance: false, message: null }),
    number: m.number,
    name: m.name,
    group: m.group,
    canSwitchOff: !alwaysOn.has(m.key),
  }));
}

/** Changes one module's switch, and records it. */
export async function setModuleState(store: ConsoleStore, ctx: ChangeContext, moduleKey: string, patch: Partial<Omit<ModuleState, "moduleKey">>): Promise<ModuleState> {
  const before = (await listModules(store)).find((m) => m.moduleKey === moduleKey);
  if (!before) throw new AppError("not_found", "Unknown module.");
  if (!before.canSwitchOff && (patch.enabled === false || patch.maintenance === true)) {
    throw new AppError("bad_request", `${before.name} keeps the system running and cannot be switched off.`);
  }
  const after: ModuleState = { moduleKey, enabled: patch.enabled ?? before.enabled, maintenance: patch.maintenance ?? before.maintenance, message: patch.message ?? before.message };
  await store.saveSwitch(after, ctx.actorId);
  await recordChange(ctx, {
    action: after.enabled === before.enabled ? "module.updated" : after.enabled ? "module.enabled" : "module.disabled",
    module: "super-admin",
    recordType: "module",
    recordId: moduleKey,
    summary: `${before.name}: ${after.enabled ? (after.maintenance ? "maintenance" : "on") : "off"}`,
    changes: { enabled: { old: before.enabled, new: after.enabled }, maintenance: { old: before.maintenance, new: after.maintenance }, message: { old: before.message, new: after.message } },
  });
  return after;
}

/** The `ModuleSwitchReader` contract for the gateway. */
export function moduleSwitchReader(store: ConsoleStore): ModuleSwitchReader {
  return {
    async stateOf(moduleKey) {
      if (alwaysOn.has(moduleKey)) return { moduleKey, enabled: true, maintenance: false, message: null };
      const saved = (await store.switches()).find((s) => s.moduleKey === moduleKey);
      return saved ?? { moduleKey, enabled: true, maintenance: false, message: null };
    },
  };
}
