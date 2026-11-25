"use client";
// S77-06 Payment methods: every way to pay, each with its switch for the
// whole system and for each outlet. Gateway methods show whether their keys
// are in, with a link to paste them on Connection settings; so going live
// needs keys only, never code. Sample only: nothing is saved yet (Phase 7).

import { KeyRound } from "lucide-react";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { OptionSwitch } from "@/shared/screens/settings/OptionSwitch";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { OUTLETS, PAYMENT_METHODS } from "../../domain/paymentMethods";

// The Connection settings page (module 14) by its address, not its code: modules never import each other.
const CONNECTION_SETTINGS = "/integrations-hub/connection-settings";

/** The payment methods page. */
export function PaymentMethodsPage({ screen }: { screen: ScreenContext }) {
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {PAYMENT_METHODS.map((m) => (
          <section key={m.name} aria-label={m.name} className="rounded-md border border-line bg-surface">
            {/* Step 1: the method, its key status and its switch for the whole system. */}
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-2">
              <h2 className="text-subtitle font-bold">{m.name}</h2>
              {m.provider && <StatusChip status="Needs keys" />}
              {m.provider && (
                <span className="ml-auto">
                  <Button variant="text" href={`${CONNECTION_SETTINGS}?provider=${m.provider}`} icon={<KeyRound size={16} aria-hidden />}>Add keys</Button>
                </span>
              )}
            </div>
            <OptionSwitch label="On for the whole system" hint={m.how} initial={m.on} />
            {/* Step 2: the outlets it is on for, each with its own switch. */}
            <details className="px-4 py-2">
              <summary className="min-h-11 cursor-pointer content-center text-label font-bold">Per outlet</summary>
              <div className="grid sm:grid-cols-2">
                {OUTLETS.map((o) => <OptionSwitch key={o} label={o} hint={m.on ? "On" : "Off until the method is on"} initial={m.on} />)}
              </div>
            </details>
          </section>
        ))}
      </div>
    </>
  );
}
