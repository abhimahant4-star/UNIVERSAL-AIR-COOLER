// Shared by the admin uploader (browser) and the server: keep free of server-only imports.

/** Each piece of a PDF is sent and stored separately, keeping every request under Vercel's 4.5 MB limit. */
export const CHUNK_SIZE = 3.5 * 1024 * 1024;

/** Largest catalogue the admin can upload. */
export const MAX_PDF_BYTES = 100 * 1024 * 1024;

export function chunkCountFor(size: number) {
  return Math.max(1, Math.ceil(size / CHUNK_SIZE));
}

/** Expected byte length of piece `index` for a file of `size` bytes. */
export function chunkLength(size: number, index: number) {
  return Math.min(CHUNK_SIZE, size - index * CHUNK_SIZE);
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Public address of a catalogue PDF. Add `?download=1` to force a download instead of opening it. */
export function catalogueUrl(slug: string) {
  return `/catalogues/${slug}.pdf`;
}
