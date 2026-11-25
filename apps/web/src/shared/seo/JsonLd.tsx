// Puts structured data (JSON-LD) into a page for search engines.

/** Renders [data] as a JSON-LD script tag. */
export function JsonLd({ data }: { data: object }) {
  // JSON.stringify output is safe here: the data is our own, never user input.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
