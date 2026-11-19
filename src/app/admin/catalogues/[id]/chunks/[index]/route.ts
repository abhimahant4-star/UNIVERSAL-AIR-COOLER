import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chunkLength } from "@/lib/catalogue";
import { oid } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Step 2 of a catalogue upload: PUT /admin/catalogues/<id>/chunks/<index> with one piece of the PDF as the raw body.
 * Admin only (also protected by middleware).
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string; index: string }> }) {
  if (!(await getSession())) return Response.json({ error: "Please log in again." }, { status: 401 });

  const { id: rawId, index: rawIndex } = await params;
  const id = oid(rawId);
  const index = Number(rawIndex);
  const c = id ? await prisma.catalogue.findUnique({ where: { id }, select: { id: true, size: true, chunkCount: true, ready: true } }) : null;
  if (!c) return Response.json({ error: "Catalogue not found." }, { status: 404 });
  if (c.ready) return Response.json({ error: "This catalogue is already uploaded." }, { status: 409 });
  if (!Number.isInteger(index) || index < 0 || index >= c.chunkCount) return Response.json({ error: "Invalid part number." }, { status: 400 });

  const data = new Uint8Array(await req.arrayBuffer());
  if (data.byteLength !== chunkLength(c.size, index)) return Response.json({ error: "Part size does not match. Please try again." }, { status: 400 });
  if (index === 0 && !isPdf(data)) return Response.json({ error: "This file is not a PDF." }, { status: 415 });

  await prisma.catalogueChunk.upsert({
    where: { catalogueId_index: { catalogueId: c.id, index } },
    update: { data },
    create: { catalogueId: c.id, index, data },
  });
  return Response.json({ ok: true });
}

function isPdf(d: Uint8Array) {
  // "%PDF-" signature, allowing a little leading junk as some generators add it
  const head = new TextDecoder("latin1").decode(d.subarray(0, 1024));
  return head.includes("%PDF-");
}
