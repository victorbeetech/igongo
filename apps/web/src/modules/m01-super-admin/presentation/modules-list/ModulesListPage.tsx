"use client";
// S01-02 Modules list: all 84 modules by group, each with its on/off switch
// and maintenance switch. Core modules cannot be switched off. Changes take
// effect at once and are recorded in the Audit Trail.

import { useModules, useSetModule } from "@/modules/m01-super-admin/data/consoleApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";

/** The modules list. */
export function ModulesListPage({ screen }: { screen: ScreenContext }) {
  const modules = useModules();
  const save = useSetModule();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={modules} name={screen.spec.name}>
        {(d) => (
          <div className="grid gap-1 pb-4">
            {[...new Set(d.items.map((m) => m.group))].map((group) => (
              <section key={group}>
                <SectionHeader title={group} />
                <div className="mx-4 rounded-md border border-line bg-surface">
                  {d.items.filter((m) => m.group === group).map((m) => (
                    <SwitchRow
                      key={m.moduleKey}
                      label={`${m.number}. ${m.name}`}
                      hint={!m.canSwitchOff ? "Core: always on" : m.maintenance ? "Maintenance" : m.enabled ? "On" : "Off"}
                      on={m.enabled && !m.maintenance}
                      disabled={!m.canSwitchOff || save.isPending}
                      onChange={(on) => save.mutate({ moduleKey: m.moduleKey, enabled: on, maintenance: false })}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </LiveData>
    </>
  );
}
