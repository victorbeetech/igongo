"use client";
// A button whose only job in the prototype is to confirm with a toast, such
// as Save or Submit on a page with no next page.

import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "@/shared/ui/button/Button";
import { showToast } from "@/shared/ui/toast/toast";

/** A button that shows [message] as a toast. */
export function ToastButton({ message, children, variant = "primary" }: { message: string; children: ReactNode; variant?: ButtonVariant }) {
  return <Button block variant={variant} onClick={() => showToast(message)}>{children}</Button>;
}
