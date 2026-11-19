import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Public catalogue download: GET /catalogues/<slug>.pdf (opens in the browser) or ?download=1 (saves the file).
 * The PDF is streamed piece by piece, so large files work on Vercel (streamed responses have no 4.5 MB cap).
 */
export async function GET(req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const slug = file.replace(/\.pdf$/i, "");
  if (!/^[a-z0-9-]{1,90}$/.test(slug)) return new Response("Not found", { status: 404 });

  const c = await prisma.catalogue.findFirst({ where: { slug, ready: true, visible: true } });
  if (!c) return new Response("Catalogue not found", { status: 404 });

  const download = new URL(req.url).searchParams.has("download");
  prisma.catalogue.update({ where: { id: c.id }, data: { downloads: { increment: 1 } } }).catch(() => {});

  let index = 0;
  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (index >= c.chunkCount) return controller.close();
      const chunk = await prisma.catalogueChunk.findUnique({ where: { catalogueId_index: { catalogueId: c.id, index } } });
      if (!chunk) return controller.error(new Error(`Missing part ${index} of ${c.slug}`));
      controller.enqueue(new Uint8Array(chunk.data));
      index++;
    },
  });

  const name = c.fileName.toLowerCase().endsWith(".pdf") ? c.fileName : `${c.fileName}.pdf`;
  const ascii = name.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");
  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
