// The result layout: the outcome of a step, such as Booking confirmed or
// Account locked, with where to go next.

import { CheckCircle2, Info } from "lucide-react";
import { catalog } from "@/shared/catalog/catalogIndex";
import type { ScreenContext } from "@/shared/catalog/types";
import { hrefFor } from "@/shared/navigation/hrefFor";
import { Button } from "@/shared/ui/button/Button";
import { illustrationFor } from "@/shared/ui/illustration/illustrationFor";
import { StateMessage } from "@/shared/ui/message/StateMessage";

/** The outcome of a step. */
export function ResultLayout({ screen }: { screen: ScreenContext }) {
  const here = catalog.hrefOf(screen.spec);
  // Good news is green with a tick; everything else is a warning.
  const good = /(confirmed|placed|sent|result)/i.test(screen.spec.name);
  const targets = [...screen.spec.opens, ...screen.spec.dialogs];
  return (
    <StateMessage icon={good ? <CheckCircle2 size={36} /> : <Info size={36} />} illustration={illustrationFor(screen.spec.name)} tone={good ? "success" : "warning"} title={screen.spec.name} message={screen.spec.purpose}>
      {targets.map((id, i) => (
        <Button key={id} href={hrefFor(id, here)} variant={i === 0 ? "primary" : "secondary"}>
          {id === "home" ? "Done" : catalog.nameOf(id)}
        </Button>
      ))}
      {targets.length === 0 && <Button href="/home">Back to home</Button>}
    </StateMessage>
  );
}
