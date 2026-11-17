import "server-only";
import { randomBytes } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const MAX_BYTES = 5 * 1024 * 1024;
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
  if (file.size > MAX_BYTES) throw new Error(`${file.name} is larger than 5 MB.`);
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${name}`;
}

/** Deletes a file previously returned by saveImage. Ignores anything outside the uploads folder. */
export async function deleteImage(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const target = path.normalize(path.join(UPLOAD_ROOT, url.slice("/uploads/".length)));
  if (!target.startsWith(UPLOAD_ROOT + path.sep)) return;
  await unlink(target).catch(() => {});
}
