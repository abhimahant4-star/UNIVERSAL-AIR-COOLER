import "server-only";
import { randomBytes } from "crypto";
import { prisma } from "./db";

// Images are stored in MongoDB (Upload collection) and served by src/app/uploads/[...path]/route.ts.
// Keep each file under ~4 MB: Vercel rejects request bodies over 4.5 MB.
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export function validFiles(list: FormDataEntryValue[]) {
  return list.filter((f): f is File => typeof f === "object" && "size" in f && f.size > 0);
}

/** Saves an uploaded image and returns its public URL (/uploads/<folder>/<file>). */
export async function saveImage(file: File, folder: "products" | "gallery" | "site"): Promise<string> {
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error(`Unsupported image type for ${file.name}. Use JPG, PNG, WEBP, GIF or AVIF.`);
  if (file.size > MAX_BYTES) throw new Error(`${file.name} is larger than 4 MB. Please resize it and try again.`);
  const path = `${folder}/${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const data = new Uint8Array(await file.arrayBuffer());
  await prisma.upload.create({ data: { path, contentType: file.type, size: data.byteLength, data } });
  return `/uploads/${path}`;
}

/** Deletes an image previously returned by saveImage. Ignores anything that is not an upload URL. */
export async function deleteImage(url: string) {
  if (!url.startsWith("/uploads/")) return;
  await prisma.upload.deleteMany({ where: { path: url.slice("/uploads/".length) } }).catch(() => {});
}
