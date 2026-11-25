"use client";
// Opens the dialog named in the address (`?dialog=`) over the current page:
// a side sheet for choices, a centred dialog for everything else. Confirm
// goes to the dialog's next page, or shows a toast when it has none.

import { useEffect, useRef } from "react";
import { catalog } from "@/shared/catalog/catalogIndex";
import { hintFor } from "@/shared/mock/sampleText";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { useAddress } from "@/shared/navigation/useAddress";
import { Button } from "@/shared/ui/button/Button";
import { Field } from "@/shared/ui/field/Field";
import { showToast } from "@/shared/ui/toast/toast";
import { TONE_STYLES } from "./toneStyle";

/** Shows the dialog from the address, if any. Put one on every page. */
export function DialogHost() {
  // The address works the same in the normal build and the static preview.
  const { params, path, push, replace } = useAddress();
  const ref = useRef<HTMLDialogElement>(null);
  const dialog = catalog.dialogBySlug(params.get("dialog") ?? "");

  // Step 1: open the native dialog when one is named, so focus and Escape work.
  useEffect(() => {
    if (dialog && !ref.current?.open) ref.current?.showModal();
  }, [dialog]);
  if (!dialog) return null;

  // Step 2: closing removes `?dialog=` from the address; confirming goes on.
  const close = () => replace(path);
  const confirm = () => {
    const next = dialog.opens[0];
    if (next) push(hrefFor(next, path));
    else {
      showToast(`${dialog.name}: done`);
      close();
    }
  };
  const style = TONE_STYLES[dialog.tone];
  const sheet = dialog.tone === "sheet";
  const fields = catalog.module(dialog.id.slice(1, 3)).mock.fields.slice(0, 2);

  // Step 3: the dialog itself; a sheet slides in from the right on the web.
  return (
    <dialog
      ref={ref}
      onClose={close}
      aria-labelledby="dialog-title"
      className={`bg-surface text-ink backdrop:bg-black/50 ${sheet ? "ml-auto h-full max-h-none w-full max-w-md p-6" : "m-auto w-[min(92vw,28rem)] rounded-lg p-6 text-center"}`}
    >
      <div className={`grid gap-3 ${sheet ? "" : "justify-items-center"}`}>
        {style.icon}
        <h2 id="dialog-title" className="text-title font-bold">{dialog.name}</h2>
        <p className="text-body text-muted">{dialog.purpose}</p>
        {sheet && fields.map((f) => <Field key={f} label={f} hint={hintFor(f)} />)}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {/* A warning only needs OK; the others can be cancelled. */}
          {dialog.tone !== "warning" && <Button variant="text" onClick={close}>Cancel</Button>}
          <Button variant={style.variant} onClick={confirm}>{style.confirm}</Button>
        </div>
      </div>
    </dialog>
  );
}
