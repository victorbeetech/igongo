// A round avatar with up to two initials, used until photos exist.

/** Shows the initials of [name] in a soft brand circle. */
export function InitialsAvatar({ name, size = 36 }: { name: string; size?: number }) {
  // The first letters of the first two words that start with a letter.
  const initials = name.split(/[\s·]+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
  return (
    <span aria-hidden className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-container text-label font-bold text-on-primary-container" style={{ width: size, height: size }}>
      {initials}
    </span>
  );
}
