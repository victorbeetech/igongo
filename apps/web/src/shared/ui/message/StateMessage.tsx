// The centred message used by every state and result: an icon in a soft
// circle, a title, a line of text and the actions.

import type { ReactNode } from "react";

/** Which colour the icon takes. */
export type MessageTone = "primary" | "success" | "warning" | "error";

const TONES: Record<MessageTone, string> = {
  primary: "text-primary bg-primary/12",
  success: "text-success bg-success/12",
  warning: "text-warning bg-warning/12",
  error: "text-error bg-error/12",
};

/** A centred icon, title, message and actions. */
export function StateMessage({ icon, title, message, tone = "primary", children }: { icon: ReactNode; title: string; message: string; tone?: MessageTone; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-12 text-center">
      <span className={`rounded-full p-4 ${TONES[tone]}`}>{icon}</span>
      <h2 className="text-title font-bold">{title}</h2>
      <p className="text-body text-muted">{message}</p>
      {children && <div className="flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
