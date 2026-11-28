"use client";
// A booking module's settings page, shared by every booking module (Rooms, Museum,
// Events, Pool, Venues, Tables, Shop). It shows the rules (deposit, approval, cancel
// deadline, limit) and what is on sale (prices, capacity, times and dates). People
// with the module's settings permissions can change them here, with no code changes;
// everyone else sees the same page read-only.

import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { can, useMe } from "@/shared/session/useMe";
import { Card } from "@/shared/ui/card/Card";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SkeletonList } from "@/shared/ui/skeleton/SkeletonList";
import { useRules } from "../data/bookingsApi";
import type { BookingPlace } from "../types/bookingPlace";
import type { OfferingKind } from "../types/offering";
import { AddOfferingForm } from "./settings/AddOfferingForm";
import { OfferingsSection } from "./settings/OfferingsSection";
import { RulesForm } from "./settings/RulesForm";
import { RulesView } from "./settings/RulesView";
import { settingsPermissions } from "./settings/settingsPermissions";

/** The settings page for one booking module. `kinds` lists what the module sells. */
export function BookingSettingsPage({ screen, place, kinds }: { screen: ScreenContext; place: BookingPlace; kinds: OfferingKind[] }) {
  // Who is signed in decides which forms are drawn. Until that is known, show a placeholder
  // rather than a form that might disappear.
  const me = useMe();
  const rules = useRules(place);
  const keys = settingsPermissions(place.module);
  const canRules = can(me.data, keys.rules);
  const canOffer = can(me.data, keys.offerings);
  const knowsWho = !me.isPending;
  const readOnlyNote = knowsWho && !canRules && !canOffer;

  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        {readOnlyNote && (
          <Card>
            <p className="text-body">You can see these settings. Ask the super admin for the settings permissions to change them.</p>
          </Card>
        )}
        {!knowsWho ? (
          <SkeletonList rows={3} />
        ) : (
          <LiveData query={rules} name="Rules">
            {(r) => (canRules ? <RulesForm place={place} initial={r} /> : <RulesView rules={r} />)}
          </LiveData>
        )}
        <SectionHeader title="On sale" />
        {knowsWho && <OfferingsSection place={place} kinds={kinds} canChange={canOffer} />}
        {knowsWho && canOffer && <AddOfferingForm place={place} kinds={kinds} />}
      </div>
    </>
  );
}
