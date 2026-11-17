import { prisma } from "@/lib/db";

// Serves images stored in the database (see src/lib/upload.ts). File names are unique, so they are cached forever.
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join("/");
  if (!/^[a-z]+\/[\w.-]+$/i.test(path)) return new Response("Not found", { status: 404 });
  const file = await prisma.upload.findUnique({ where: { path } });
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}
