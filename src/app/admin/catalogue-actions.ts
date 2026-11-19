"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { deleteImage, saveImage, validFiles } from "@/lib/upload";
import { MAX_PDF_BYTES, chunkCountFor } from "@/lib/catalogue";
import { oid, slugify } from "@/lib/utils";

const PATH = "/admin/catalogues";
const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);

function done(kind: "msg" | "error", text: string): never {
  revalidatePath("/", "layout");
  redirect(`${PATH}?${kind}=${encodeURIComponent(text)}`);
}

async function uniqueSlug(title: string, exceptId?: string) {
  const base = slugify(title) || "catalogue";
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const hit = await prisma.catalogue.findUnique({ where: { slug }, select: { id: true } });
    if (!hit || hit.id === exceptId) return slug;
  }
}

export type StartResult = { id?: string; chunkCount?: number; error?: string };

/** Step 1 of an upload: creates the (not yet visible) catalogue record. The browser then sends the PDF in pieces. */
export async function startCatalogue(fd: FormData): Promise<StartResult> {
  await requireAdmin();
  const title = str(fd, "title", 150);
  const description = str(fd, "description", 600);
  const fileName = str(fd, "fileName", 200).replace(/[^\w.\- ()]/g, "_") || "catalogue.pdf";
  const size = Number(fd.get("size"));
  if (!title) return { error: "Please enter a title." };
  if (!Number.isInteger(size) || size <= 0) return { error: "Please choose a PDF file." };
  if (size > MAX_PDF_BYTES) return { error: "The PDF is larger than 100 MB. Please compress it and try again." };

  let coverUrl = "";
  const cover = validFiles(fd.getAll("cover"))[0];
  if (cover) {
    try {
      coverUrl = await saveImage(cover, "site");
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const chunkCount = chunkCountFor(size);
  const max = await prisma.catalogue.aggregate({ _max: { sortOrder: true } });
  const c = await prisma.catalogue.create({
    data: { title, description, fileName, size, chunkCount, coverUrl, slug: await uniqueSlug(title), sortOrder: (max._max.sortOrder ?? 0) + 1 },
  });
  return { id: c.id, chunkCount };
}

/** Step 3: checks every piece arrived, then publishes the catalogue. */
export async function finishCatalogue(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const cid = oid(id);
  const c = cid ? await prisma.catalogue.findUnique({ where: { id: cid } }) : null;
  if (!c) return { error: "Catalogue not found." };
  const received = await prisma.catalogueChunk.count({ where: { catalogueId: c.id, index: { lt: c.chunkCount } } });
  if (received !== c.chunkCount) return { error: `Upload incomplete (${received} of ${c.chunkCount} parts received). Please try again.` };
  await prisma.catalogue.update({ where: { id: c.id }, data: { ready: true } });
  revalidatePath("/", "layout");
  return {};
}

/** Removes a catalogue whose upload failed or was cancelled. */
export async function cancelCatalogue(id: string) {
  await requireAdmin();
  const cid = oid(id);
  if (!cid) return;
  await removeCatalogue(cid);
}

async function removeCatalogue(id: string) {
  const c = await prisma.catalogue.findUnique({ where: { id } });
  if (!c) return;
  await prisma.catalogueChunk.deleteMany({ where: { catalogueId: id } });
  await prisma.catalogue.delete({ where: { id } });
  if (c.coverUrl) await deleteImage(c.coverUrl);
}

export async function updateCatalogue(fd: FormData) {
  await requireAdmin();
  const id = oid(fd.get("id"));
  const c = id ? await prisma.catalogue.findUnique({ where: { id } }) : null;
  if (!c) done("error", "Catalogue not found.");
  const title = str(fd, "title", 150) || c.title;

  let coverUrl = c.coverUrl;
  const cover = validFiles(fd.getAll("cover"))[0];
  if (cover) {
    try {
      coverUrl = await saveImage(cover, "site");
    } catch (e) {
      done("error", (e as Error).message);
    }
    if (c.coverUrl) await deleteImage(c.coverUrl);
  } else if (fd.get("removeCover") === "on" && c.coverUrl) {
    await deleteImage(c.coverUrl);
    coverUrl = "";
  }

  await prisma.catalogue.update({
    where: { id: c.id },
    data: {
      title,
      slug: title === c.title ? c.slug : await uniqueSlug(title, c.id),
      description: str(fd, "description", 600),
      sortOrder: Number(fd.get("sortOrder")) || 0,
      visible: fd.get("visible") === "on",
      coverUrl,
    },
  });
  done("msg", "Catalogue saved.");
}

export async function deleteCatalogue(fd: FormData) {
  await requireAdmin();
  const id = oid(fd.get("id"));
  if (!id) done("error", "Catalogue not found.");
  await removeCatalogue(id);
  done("msg", "Catalogue deleted.");
}
