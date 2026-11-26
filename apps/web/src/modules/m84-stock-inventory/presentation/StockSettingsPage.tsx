"use client";
// S84-06 Units and conversions and S84-20 Stock settings: the super admin's
// categories and units (one per line), whether stores may go below zero and
// whether changes need a reason. Saved to the API; no code changes. The
// paperwork desk's types, fields and approval steps sit below on S84-20.

import { useState } from "react";
import { LiveData } from "@/shared/api/LiveData";
import type { ScreenContext } from "@/shared/catalog/types";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { RecordSettingsPage } from "@/shared/records/presentation/RecordSettingsPage";
import { Button } from "@/shared/ui/button/Button";
import { TextArea } from "@/shared/ui/field/TextArea";
import { SectionHeader } from "@/shared/ui/section/SectionHeader";
import { SwitchRow } from "@/shared/ui/switch/SwitchRow";
import { useSaveStockSettings, useStockSettings } from "../data/stockApi";
import { DESK } from "../domain/place";
import type { StockSettings } from "../domain/stockSettings";

export function StockSettingsPage({ screen, desk }: { screen: ScreenContext; desk?: boolean }) {
  const settings = useStockSettings();
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <div className="grid gap-3 p-4">
        <LiveData query={settings} name="Stock settings">{(s) => <SettingsForm initial={s} />}</LiveData>
      </div>
      {desk && (
        <>
          <SectionHeader title="Requisitions, orders and suppliers" />
          <RecordSettingsPage screen={screen} place={DESK} />
        </>
      )}
    </>
  );
}

/** Lines of text as a list, without blanks or repeats. */
const lines = (v: string) => [...new Set(v.split("\n").map((x) => x.trim()).filter(Boolean))];

function SettingsForm({ initial }: { initial: StockSettings }) {
  const save = useSaveStockSettings();
  const [s, setS] = useState(initial);
  // The lists are typed as text and read into lists on save, so new lines can be typed.
  const [categories, setCategories] = useState(initial.categories.join("\n"));
  const [units, setUnits] = useState(initial.units.join("\n"));
  const ready = lines(categories).length > 0 && lines(units).length > 0;
  return (
    <>
      <TextArea label="Categories (one per line)" value={categories} onChange={setCategories} rows={6} />
      <TextArea label="Units (one per line)" value={units} onChange={setUnits} rows={6} />
      <SwitchRow label="Allow a store to go below zero" on={s.allowNegative} onChange={(allowNegative) => setS({ ...s, allowNegative })} />
      <SwitchRow label="Ask for a reason on adjustments and waste" on={s.reasonRequired} onChange={(reasonRequired) => setS({ ...s, reasonRequired })} />
      <div>
        <Button onClick={() => save.mutate({ ...s, categories: lines(categories), units: lines(units) })} disabled={save.isPending || !ready}>Save stock settings</Button>
      </div>
    </>
  );
}
