"use client";
// The recovery codes, shown once: copy or download them and keep them safe.
// Each code signs in once if the phone with the authenticator app is lost.

import { Button } from "@/shared/ui/button/Button";
import { showToast } from "@/shared/ui/toast/toast";

/** The codes in a grid, with Copy and Download. */
export function RecoveryCodes({ codes }: { codes: string[] }) {
  const text = codes.join("\n");
  const copy = () =>
    void navigator.clipboard.writeText(text).then(
      () => showToast("Recovery codes copied"),
      () => showToast("Copy did not work. Write the codes down."),
    );
  const download = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([`Igongo recovery codes. Each works once.\n\n${text}\n`], { type: "text/plain" }));
    link.download = "igongo-recovery-codes.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <div className="grid gap-2 rounded-md border border-warning/50 bg-warning/10 p-3">
      <p className="text-caption font-bold">Save these recovery codes now. They are shown only once.</p>
      <ul className="grid grid-cols-2 gap-1 font-mono text-caption">
        {codes.map((c) => <li key={c}>{c}</li>)}
      </ul>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={copy}>Copy</Button>
        <Button variant="secondary" onClick={download}>Download</Button>
      </div>
    </div>
  );
}
