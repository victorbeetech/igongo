"use client";
// S11-04 Files settings: the largest file people may upload and the types
// allowed (photos and PDFs to start with).

import { useState } from "react";
import { useFileRules, useSaveFileRules, type FileRules } from "@/modules/m11-files-media/data/filesApi";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The settings page. */
export function FileSettingsPage({ screen }: { screen: ScreenContext }) {
  const rules = useFileRules();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={rules} name={screen.spec.name}>{(r) => <RulesForm key={JSON.stringify(r)} initial={r} />}</LiveData>
    </>
  );
}

/** The form; types are typed with commas, such as image/jpeg, image/png. */
function RulesForm({ initial }: { initial: FileRules }) {
  const save = useSaveFileRules();
  const [maxMb, setMaxMb] = useState(String(initial.maxMb));
  const [types, setTypes] = useState(initial.allowedTypes.join(", "));
  const allowedTypes = types.split(",").map((t) => t.trim().toLowerCase()).filter((t) => /^[a-z]+\/[a-z0-9.+-]+$/.test(t));
  return (
    <div className="grid max-w-lg gap-3 p-4">
      <TextInput label="Largest file (MB)" type="number" value={maxMb} onChange={setMaxMb} />
      <TextInput label="Allowed types" value={types} onChange={setTypes} hint="Such as image/jpeg, image/png, application/pdf" />
      <Button disabled={save.isPending || allowedTypes.length === 0 || !(Number(maxMb) > 0)} onClick={() => save.mutate({ maxMb: Math.min(50, Number(maxMb)), allowedTypes })}>Save settings</Button>
    </div>
  );
}
