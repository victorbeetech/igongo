// The one button used on every page, in four variants. It is a link when
// given `href`, and a button when given `onClick`. Colours come from tokens.

import Link from "next/link";
import type { ReactNode } from "react";

/** How important the action is. */
export type ButtonVariant = "primary" | "secondary" | "danger" | "text";

// One class list per variant; every size and colour is a token.
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-dark",
  secondary: "border border-line text-ink hover:bg-surface-alt",
  // Danger text uses on-error: white on light-mode red, night on the lighter dark-mode red (both checked 4.5:1).
  danger: "bg-error text-on-error hover:opacity-90",
  text: "text-primary-text underline-offset-4 hover:underline",
};

interface ButtonProps {
  /** The words on the button. */
  children: ReactNode;
  /** Where the button goes, for navigation. */
  href?: string;
  /** What the button does, for actions. */
  onClick?: () => void;
  /** How important it is. */
  variant?: ButtonVariant;
  /** An icon before the words. */
  icon?: ReactNode;
  /** Fill the width. */
  block?: boolean;
}

/** An Igongo button or link-button. */
export function Button({ children, href, onClick, variant = "primary", icon, block }: ButtonProps) {
  // Every button is at least 44 pixels tall: the minimum tap target.
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-label font-bold transition-colors ${VARIANTS[variant]} ${block ? "w-full" : ""}`;
  const body = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {body}
    </button>
  );
}
