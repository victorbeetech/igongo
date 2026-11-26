"use client";
// S40-01 Report fault: what is broken, where, how urgent, and photos. The
// categories come from the super admin's list (S40-07).

import { useState, type FormEvent } from "react";
import { FAULT_PRIORITIES, useFaultSettings, useReportFault } from "@/modules/m40-faults-maintenance/data/faultsApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { PhotoPicker } from "@/shared/files/PhotoPicker";
import { words } from "@/shared/format/when";
import { recordHref } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The report form. */
export function ReportFaultPage({ screen }: { screen: ScreenContext }) {
  const settings = useFaultSettings();
  const report = useReportFault();
  const address = useAddress();
  const [f, setF] = useState({ title: "", description: "", category: "", location: "", priority: "normal", photoIds: [] as string[] });
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={settings} name="Fault categories">
        {(s) => {
          // Step 1: check the photo rule here too, so the person sees why before sending.
          const missingPhoto = s.photoRequired && f.photoIds.length === 0;
          function submit(event: FormEvent) {
            event.preventDefault();
            report.mutate(
              { title: f.title, description: f.description, category: f.category || null, location: f.location || null, priority: f.priority, photoIds: f.photoIds },
              { onSuccess: (fault) => address.push(recordHref(catalog.screen("S40-04")!, fault.id)) },
            );
          }
          return (
            <form onSubmit={submit} className="grid max-w-2xl gap-3 p-4">
              <TextInput label="What is wrong?" value={f.title} onChange={(title) => setF({ ...f, title })} required hint="Such as: Tap leaking in room 12" />
              <TextArea label="Details" value={f.description} onChange={(description) => setF({ ...f, description })} rows={4} />
              <SelectInput label="Category" value={f.category} onChange={(category) => setF({ ...f, category })} options={[["", "Not sure"], ...s.categories.map((c): [string, string] => [c.key, c.name])]} />
              <TextInput label="Where" value={f.location} onChange={(location) => setF({ ...f, location })} hint="Room, building or area" />
              <SelectInput label="How urgent" value={f.priority} onChange={(priority) => setF({ ...f, priority })} options={FAULT_PRIORITIES.map((p): [string, string] => [p, words(p)])} />
              <PhotoPicker purpose="faults-maintenance" value={f.photoIds} onChange={(photoIds) => setF({ ...f, photoIds })} max={10} label={s.photoRequired ? "Photos (at least one)" : "Photos"} />
              <Button type="submit" disabled={report.isPending || missingPhoto || f.title.trim().length < 3}>Report fault</Button>
            </form>
          );
        }}
      </LiveData>
    </>
  );
}
