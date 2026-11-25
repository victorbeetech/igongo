// Shown on the web when a link leads to a screen that lives in the app only,
// such as a scanner or the rider's live trip.

import { Smartphone } from "lucide-react";
import type { ScreenContext } from "@/shared/catalog/types";
import { Button } from "@/shared/ui/button/Button";
import { StateMessage } from "@/shared/ui/message/StateMessage";

/** Explains that this screen is in the Igongo app. */
export function AppOnlyLayout({ screen }: { screen: ScreenContext }) {
  return (
    <StateMessage icon={<Smartphone size={36} />} title={`${screen.spec.name} is in the Igongo app`} message={`${screen.spec.purpose}. Open the Igongo app on your phone to use it.`}>
      <Button href="/home">Back to home</Button>
    </StateMessage>
  );
}
