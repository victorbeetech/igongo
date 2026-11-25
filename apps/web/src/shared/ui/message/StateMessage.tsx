// The centred message used by every state and result: an icon in a soft
// circle, a title, a line of text and the actions.

import type { ReactNode } from "react";
import { StateIllustration } from "@/shared/ui/illustration/StateIllustration";
import type { IllustrationKind } from "@/shared/ui/illustration/illustrations.g";

/** Which colour the icon takes. */
export type MessageTone = "primary" | "muted" | "success" | "warning" | "error";

const TONES: Record<MessageTone, string> = {
  primary: "text-primary-text bg-primary/12",
  muted: "text-muted bg-muted/12",
  success: "text-success bg-success/12",
  warning: "text-warning bg-warning/12",
  error: "text-error bg-error/12",
};

/** A centred icon (or brand kit drawing, when [illustration] is set), title, message and actions. */
export function StateMessage({ icon, illustration, title, message, tone = "primary", children }: { icon: ReactNode; illustration?: IllustrationKind; title: string; message: string; tone?: MessageTone; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-12 text-center">
      {/* The drawing takes only the tone's text colour; the icon also sits in a soft circle. */}
      {illustration ? <StateIllustration kind={illustration} className={TONES[tone].split(" ")[0]} /> : <span className={`rounded-full p-4 ${TONES[tone]}`}>{icon}</span>}
      <h2 className="text-title font-bold">{title}</h2>
      <p className="text-body text-muted">{message}</p>
      {children && <div className="flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
