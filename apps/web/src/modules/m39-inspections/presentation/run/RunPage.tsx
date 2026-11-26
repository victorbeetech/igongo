"use client";
// S39-02 Run inspection: answer each line OK, fault or not applicable, add a
// note and photos to faults, and submit. Lines marked "raise fault" open a
// fault report in module 40 by themselves.

import { useState } from "react";
import { useChecklists, useSubmitRun, type CheckAnswer, type Checklist } from "@/modules/m39-inspections/data/inspectionsApi";
import { LiveData } from "@/shared/api/LiveData";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { PhotoPicker } from "@/shared/files/PhotoPicker";
import { recordHref } from "@/shared/navigation/recordId";
import { useAddress } from "@/shared/navigation/useAddress";
import { PurposeText } from "@/shared/screens/parts/PurposeText";
import { Button } from "@/shared/ui/button/Button";
import { Card } from "@/shared/ui/card/Card";
import { SelectInput } from "@/shared/ui/field/SelectInput";
import { TextArea } from "@/shared/ui/field/TextArea";
import { TextInput } from "@/shared/ui/field/TextInput";

/** The answer words. */
const ANSWERS: [CheckAnswer, string][] = [["ok", "OK"], ["fault", "Fault"], ["na", "Not applicable"]];

/** The run page; the checklist comes from `?checklist=` or a picker. */
export function RunPage({ screen }: { screen: ScreenContext }) {
  const address = useAddress();
  const lists = useChecklists();
  const [chosen, setChosen] = useState(address.params.get("checklist") ?? "");
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <LiveData query={lists} name="Checklists" isEmpty={(d) => d.items.filter((c) => c.active).length === 0}>
        {(d) => {
          const active = d.items.filter((c) => c.active);
          const checklist = active.find((c) => c.id === chosen);
          return (
            <div className="grid max-w-3xl gap-3 p-4">
              <SelectInput label="Checklist" value={chosen} onChange={setChosen} options={[["", "Choose…"], ...active.map((c): [string, string] => [c.id, `${c.name} (${c.department})`])]} />
              {checklist && <RunForm key={checklist.id} checklist={checklist} />}
            </div>
          );
        }}
      </LiveData>
    </>
  );
}

/** The answers for one checklist. */
function RunForm({ checklist }: { checklist: Checklist }) {
  const submit = useSubmitRun();
  const address = useAddress();
  // Step 1: every line starts as OK, so the HOD only changes what is wrong.
  const [answers, setAnswers] = useState(checklist.items.map((i) => ({ key: i.key, result: "ok" as CheckAnswer, note: "", photoIds: [] as string[] })));
  const [note, setNote] = useState("");
  const set = (index: number, change: Partial<(typeof answers)[number]>) => setAnswers(answers.map((a, i) => (i === index ? { ...a, ...change } : a)));
  function send() {
    submit.mutate(
      { checklistId: checklist.id, answers: answers.map((a) => ({ ...a, note: a.note || null })), note: note || null },
      { onSuccess: (run) => address.push(recordHref(catalog.screen("S39-03")!, run.id)) },
    );
  }
  return (
    <>
      {checklist.items.map((item, i) => (
        <Card key={item.key}>
          <p className="text-subtitle font-bold">{item.label}</p>
          <SelectInput label="Result" value={answers[i]!.result} onChange={(v) => set(i, { result: v as CheckAnswer })} options={ANSWERS} />
          {answers[i]!.result === "fault" && (
            <>
              <TextInput label="What is wrong" value={answers[i]!.note} onChange={(v) => set(i, { note: v })} />
              {item.photoOnFail && <PhotoPicker purpose="inspections" value={answers[i]!.photoIds} onChange={(photoIds) => set(i, { photoIds })} />}
              {item.raiseFault && <p className="text-caption text-muted">A fault report will be opened for this line.</p>}
            </>
          )}
        </Card>
      ))}
      <TextArea label="Overall note" value={note} onChange={setNote} rows={2} />
      <Button onClick={send} disabled={submit.isPending}>Submit checkup</Button>
    </>
  );
}
