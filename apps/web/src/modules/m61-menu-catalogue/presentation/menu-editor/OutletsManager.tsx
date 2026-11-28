"use client";
// The venues list for the super admin (S61-01): every venue the hotel has, with
// its guest switch, a rename box and a remove button, then a form to add one.
// Only the super admin may change these; the API refuses everyone else.

import type { MenuSettings } from "@/shared/api/types/menuSettings";
import { Card } from "@/shared/ui/card/Card";
import { AddVenueForm } from "./AddVenueForm";
import { OutletRow } from "./OutletRow";

/** The venues card. [settings] holds every venue and the keys of those guests can see. */
export function OutletsManager({ settings }: { settings: MenuSettings }) {
  return (
    <Card className="grid gap-3">
      <h2 className="text-subtitle font-bold">Venues</h2>
      <p className="text-caption text-muted">Guests order from the venues that are switched on. A venue that still has dishes can be switched off, but not removed.</p>
      {/* Step 1: an empty list says so, instead of showing nothing. */}
      {settings.outlets.length === 0 && <p className="text-body text-muted">No venues yet. Add the first one below.</p>}
      {/* Step 2: one row per venue; the guest switch is on when its key is in the guest list. */}
      {settings.outlets.map((outlet) => (
        <OutletRow key={outlet.key} outlet={outlet} clientVisible={settings.clientOutlets.includes(outlet.key)} />
      ))}
      {/* Step 3: the form to add a new venue. */}
      <AddVenueForm />
    </Card>
  );
}
