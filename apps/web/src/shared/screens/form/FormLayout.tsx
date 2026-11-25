// The form layout: labelled fields and Continue. Fields come from the
// inventory when it names them, or from the module's sample fields.

import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hintFor } from "@/shared/mock/sampleText";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { Button } from "@/shared/ui/button/Button";
import { Field } from "@/shared/ui/field/Field";
import { DialogButtons } from "../parts/DialogButtons";
import { PurposeText } from "../parts/PurposeText";
import { ToastButton } from "../parts/ToastButton";

/** A form that collects details and submits them. */
export function FormLayout({ screen }: { screen: ScreenContext }) {
  const fields = screen.spec.fields.length ? screen.spec.fields : screen.module.mock.fields;
  const here = catalog.hrefOf(screen.spec);
  const [next, ...more] = screen.spec.opens;
  return (
    <>
      <PurposeText text={screen.spec.purpose} />
      <form className="grid max-w-xl gap-3 p-4">
        {fields.map((f) => <Field key={f} label={f} hint={hintFor(f)} type={/password/i.test(f) ? "password" : "text"} />)}
        {/* Continue goes to the next page; further choices are quieter links. */}
        {next ? <Button href={hrefFor(next, here)} block>Continue</Button> : <ToastButton message="Sent. Everyone who needs to know has been told.">Submit</ToastButton>}
        {more.map((id) => <Button key={id} variant="text" href={hrefFor(id, here)}>{catalog.nameOf(id)}</Button>)}
      </form>
      <DialogButtons screen={screen} />
    </>
  );
}
