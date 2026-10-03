// Escape literal markup so catalog text cannot close the JSON-LD script tag.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
