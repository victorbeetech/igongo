// The icon, colour and confirm words for each dialog tone, so every dialog
// of the same tone looks the same.

import { CircleHelp, SlidersHorizontal, TriangleAlert, OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { DialogTone } from "@/shared/catalog/types";
import type { ButtonVariant } from "@/shared/ui/button/Button";

/** How a dialog of one tone looks. */
export interface ToneStyle {
  icon: ReactNode;
  confirm: string;
  variant: ButtonVariant;
}

/** One style per tone: danger is red, warnings are amber. */
export const TONE_STYLES: Record<DialogTone, ToneStyle> = {
  danger: { icon: <OctagonAlert size={32} className="text-error" />, confirm: "Yes, continue", variant: "danger" },
  warning: { icon: <TriangleAlert size={32} className="text-warning" />, confirm: "OK", variant: "primary" },
  sheet: { icon: <SlidersHorizontal size={28} className="text-primary-text" />, confirm: "Done", variant: "primary" },
  confirm: { icon: <CircleHelp size={32} className="text-primary-text" />, confirm: "Confirm", variant: "primary" },
};
