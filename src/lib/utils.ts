/** Returns the value as a MongoDB ObjectId string, or null if it is not a valid one. */
export function oid(value: unknown): string | null {
  const s = String(value ?? "").trim();
  return /^[a-f0-9]{24}$/i.test(s) ? s : null;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseImages(json: string): string[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function lines(text: string) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

/** "Label: Value" lines become key/value rows; lines starting with "|" form a model table (first such line is the header). */
export function parseSpecs(text: string) {
  const pairs: { label: string; value: string }[] = [];
  const table: string[][] = [];
  for (const l of lines(text)) {
    if (l.startsWith("|")) {
      table.push(l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      continue;
    }
    const i = l.indexOf(":");
    pairs.push(i === -1 ? { label: l, value: "" } : { label: l.slice(0, i).trim(), value: l.slice(i + 1).trim() });
  }
  return { pairs, table };
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function whatsappLink(number: string, text?: string) {
  const n = number.replace(/\D/g, "");
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(d);
}
