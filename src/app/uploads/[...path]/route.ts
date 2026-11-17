import { readFile, stat } from "fs/promises";
import path from "path";
import { UPLOAD_ROOT } from "@/lib/upload";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

// Serves files the admin uploads at runtime (Next.js only serves /public files that existed at build time).
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path;
  const target = path.normalize(path.join(UPLOAD_ROOT, ...parts));
  const type = TYPES[path.extname(target).toLowerCase()];
  if (!target.startsWith(UPLOAD_ROOT + path.sep) || !type) return new Response("Not found", { status: 404 });
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error();
    const data = await readFile(target);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
