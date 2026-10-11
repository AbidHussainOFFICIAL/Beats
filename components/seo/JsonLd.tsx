/**
 * Embeds structured data (schema.org JSON-LD) in the page for search engines.
 * The "<" characters are escaped so the data can never close the script tag.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}