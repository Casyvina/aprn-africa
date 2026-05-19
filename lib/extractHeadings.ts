export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractHeadings(body: any[]): TocHeading[] {
  if (!body?.length) return [];
  return body
    .filter((b) => b._type === "block" && (b.style === "h2" || b.style === "h3"))
    .map((b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = (b.children ?? []).map((c: any) => c.text ?? "").join("");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return { id, text, level: b.style === "h2" ? 2 : 3 } as TocHeading;
    })
    .filter((h) => h.text.length > 0);
}
