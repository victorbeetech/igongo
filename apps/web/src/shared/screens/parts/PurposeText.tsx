// The line under a page title that says what the page is for.

/** The purpose line at the top of a page. */
export function PurposeText({ text }: { text: string }) {
  return <p className="px-4 pt-3 pb-1 text-body text-muted">{text}</p>;
}
