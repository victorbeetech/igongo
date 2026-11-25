"use client";
// S14-02 Connection settings: where the super admin pastes the keys of every
// outside service (payment gateways, SMS, WhatsApp, sign-in, push, maps,
// error reports), so going live needs keys only, never code. Pick a provider
// on the left; its fields, test and live mode, webhook address and Test
// button show on the right. Sample only: nothing is saved yet (Phase 8).

import { CheckCircle2, PlugZap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ScreenContext } from "@/shared/catalog/types";
import { catalog } from "@/shared/catalog/catalogIndex";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { StatusChip } from "@/shared/ui/chip/StatusChip";
import { CopyField } from "@/shared/ui/field/CopyField";
import { Field } from "@/shared/ui/field/Field";
import { SecretField } from "@/shared/ui/field/SecretField";
import { showToast } from "@/shared/ui/toast/toast";
import { PROVIDERS, providerBySlug } from "../../domain/providers";

// Where providers call Igongo back; the real address is set when the API is deployed.
const WEBHOOK_BASE = "https://api.igongo.example/hooks/";

/** The connection settings page; `?provider=` picks the provider. */
export function ConnectionSettingsPage({ screen }: { screen: ScreenContext }) {
  const { params } = useAddress();
  const provider = providerBySlug(params.get("provider"));
  const [live, setLive] = useState(false);
  const here = catalog.hrefOf(screen.spec);
  const groups = [...new Set(PROVIDERS.map((p) => p.group))];
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-4 p-4 md:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Step 1: every provider, by group, each with its status. */}
        <nav aria-label="Providers" className="grid content-start gap-3">
          {groups.map((g) => (
            <div key={g} className="grid gap-1">
              <h2 className="px-1 text-caption font-bold tracking-widest text-muted uppercase">{g}</h2>
              {PROVIDERS.filter((p) => p.group === g).map((p) => (
                <Link key={p.slug} href={`${here}?provider=${p.slug}`} aria-current={p.slug === provider.slug ? "page" : undefined}
                  className={`flex min-h-11 items-center justify-between gap-2 rounded-md px-3 text-label ${p.slug === provider.slug ? "bg-primary-container font-bold text-on-primary-container" : "hover:bg-surface-alt"}`}>
                  <span className="truncate">{p.name}</span>
                  {/* The selected provider shows its status in the panel instead: a warning chip on the red container is too faint. */}
                  {p.slug === provider.slug ? null : <StatusChip status="Needs keys" />}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        {/* Step 2: the chosen provider's settings. */}
        <section aria-labelledby="provider-title" className="grid content-start gap-4 rounded-md border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center gap-2">
            <PlugZap size={20} aria-hidden className="text-primary-text" />
            <h2 id="provider-title" className="text-title font-bold">{provider.name}</h2>
            <StatusChip status="Needs keys" />
            <p className="w-full text-body text-muted">{provider.use}. Keys are stored encrypted and never shown again in full after saving.</p>
          </div>
          {/* Test mode first; the switch to live is a separate, deliberate step. */}
          {provider.sandbox && (
            <div role="group" aria-label="Mode" className="flex w-fit rounded-md border border-outline p-0.5">
              {[["Test (sandbox)", false], ["Live", true]].map(([label, value]) => (
                <button key={String(label)} type="button" aria-pressed={live === value} onClick={() => setLive(value as boolean)}
                  className={`min-h-10 rounded-sm px-3 text-label ${live === value ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-alt"}`}>
                  {label as string}
                </button>
              ))}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {provider.fields.map((f) => (f.secret ? <SecretField key={f.label} label={f.label} hint={f.hint} /> : <Field key={f.label} label={f.label} hint={f.hint} />))}
          </div>
          {provider.webhook && <CopyField label="Webhook address (paste in the provider's dashboard)" value={`${WEBHOOK_BASE}${provider.slug}`} />}
          {/* Step 3: test the keys, then save. */}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={<CheckCircle2 size={16} aria-hidden />} onClick={() => showToast(`Sample: ${provider.name} is tested once the back end is built`)}>Test connection</Button>
            <Button onClick={() => showToast(`${provider.name} settings saved (sample)`)}>Save</Button>
          </div>
        </section>
      </div>
    </>
  );
}
