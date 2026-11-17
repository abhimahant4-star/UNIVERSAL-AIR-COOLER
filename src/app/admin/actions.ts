"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { DEFAULT_SETTINGS, type SettingKey } from "@/lib/settings";
import { deleteImage, saveImage, validFiles } from "@/lib/upload";
import { parseImages, slugify } from "@/lib/utils";

const str = (fd: FormData, k: string, max = 5000) => String(fd.get(k) ?? "").trim().slice(0, max);

function refreshSite() {
  revalidatePath("/", "layout");
}

function back(path: string, kind: "msg" | "error", text: string): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}${kind}=${encodeURIComponent(text)}`);
}

/* ---------------- Auth ---------------- */

const attempts = new Map<string, { n: number; until: number }>();

export type LoginState = { error?: string };

export async function login(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = str(fd, "email", 200).toLowerCase();
  const password = String(fd.get("password") ?? "");
  const a = attempts.get(email);
  if (a && a.until > Date.now()) return { error: "Too many failed attempts. Please wait 10 minutes and try again." };

  const admin = await prisma.admin.findUnique({ where: { email } });
  const ok = admin ? await bcrypt.compare(password, admin.passwordHash) : false;
  if (!admin || !ok) {
    const n = (a?.n ?? 0) + 1;
    attempts.set(email, { n: n >= 5 ? 0 : n, until: n >= 5 ? Date.now() + 10 * 60 * 1000 : 0 });
    return { error: "Invalid email or password." };
  }
  attempts.delete(email);
  await createSession({ adminId: admin.id, email: admin.email, name: admin.name });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(fd: FormData) {
  const session = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const admin = await prisma.admin.findUnique({ where: { id: session.adminId } });
  if (!admin || !(await bcrypt.compare(current, admin.passwordHash))) back("/admin/settings", "error", "Current password is incorrect.");
  if (next.length < 8) back("/admin/settings", "error", "New password must be at least 8 characters.");
  if (next !== confirm) back("/admin/settings", "error", "New passwords do not match.");
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  back("/admin/settings", "msg", "Password changed successfully.");
}

/* ---------------- Products ---------------- */

/** Deletes product image files, unless another product still uses the same file. */
async function deleteUnusedProductImages(urls: string[]) {
  for (const u of urls) {
    const stillUsed = await prisma.product.count({ where: { images: { contains: `"${u}"` } } });
    if (!stillUsed) await deleteImage(u);
  }
}

async function uniqueSlug(base: string, excludeId?: number) {
  const root = slugify(base) || "product";
  let slug = root;
  for (let i = 2; ; i++) {
    const hit = await prisma.product.findUnique({ where: { slug } });
    if (!hit || hit.id === excludeId) return slug;
    slug = `${root}-${i}`;
  }
}

export async function saveProduct(id: number | null, fd: FormData) {
  await requireAdmin();
  const formPath = id ? `/admin/products/${id}` : "/admin/products/new";
  const name = str(fd, "name", 150);
  if (name.length < 2) back(formPath, "error", "Product name is required.");

  const existing = id ? await prisma.product.findUnique({ where: { id } }) : null;
  if (id && !existing) back("/admin/products", "error", "Product not found.");

  // Images: keep the ones not marked for removal, then append new uploads.
  const current = existing ? parseImages(existing.images) : [];
  const remove = new Set(fd.getAll("removeImage").map(String));
  let images = current.filter((u) => !remove.has(u));
  const files = validFiles(fd.getAll("images"));
  try {
    for (const f of files) images.push(await saveImage(f, "products"));
  } catch (e) {
    back(formPath, "error", (e as Error).message);
  }
  const cover = str(fd, "coverImage", 300);
  if (cover && images.includes(cover)) images = [cover, ...images.filter((u) => u !== cover)];

  const priceRaw = str(fd, "price", 20).replace(/[,\s₹]/g, "");
  const price = priceRaw ? Number(priceRaw) : null;
  if (price !== null && (!Number.isFinite(price) || price < 0)) back(formPath, "error", "Price must be a valid number.");
  const categoryId = Number(fd.get("categoryId")) || null;

  const data = {
    name,
    slug: await uniqueSlug(str(fd, "slug", 100) || name, id ?? undefined),
    categoryId,
    shortDescription: str(fd, "shortDescription", 300),
    description: str(fd, "description", 10000),
    features: str(fd, "features", 5000),
    specs: str(fd, "specs", 5000),
    price,
    showPrice: fd.get("showPrice") === "on",
    featured: fd.get("featured") === "on",
    active: fd.get("active") === "on",
    metaTitle: str(fd, "metaTitle", 120),
    metaDescription: str(fd, "metaDescription", 300),
    images: JSON.stringify(images),
  };

  const saved = id ? await prisma.product.update({ where: { id }, data }) : await prisma.product.create({ data });
  await deleteUnusedProductImages(current.filter((u) => remove.has(u)));
  refreshSite();
  back(`/admin/products/${saved.id}`, "msg", id ? "Product updated." : "Product created.");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const p = await prisma.product.findUnique({ where: { id } });
  if (p) {
    await prisma.product.delete({ where: { id } });
    await deleteUnusedProductImages(parseImages(p.images));
  }
  refreshSite();
  back("/admin/products", "msg", "Product deleted.");
}

export async function toggleProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const field = fd.get("field") === "featured" ? "featured" : "active";
  const p = await prisma.product.findUnique({ where: { id } });
  if (p) await prisma.product.update({ where: { id }, data: { [field]: !p[field] } });
  refreshSite();
  revalidatePath("/admin/products");
}

/* ---------------- Categories ---------------- */

export async function saveCategory(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const name = str(fd, "name", 100);
  if (name.length < 2) back("/admin/categories", "error", "Category name is required.");
  const root = slugify(str(fd, "slug", 100) || name) || "category";
  let slug = root;
  for (let i = 2; ; i++) {
    const hit = await prisma.category.findUnique({ where: { slug } });
    if (!hit || hit.id === id) break;
    slug = `${root}-${i}`;
  }
  const data = { name, slug, description: str(fd, "description", 500), sortOrder: Number(fd.get("sortOrder")) || 0 };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  refreshSite();
  back("/admin/categories", "msg", id ? "Category updated." : "Category added.");
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: Number(fd.get("id")) } }).catch(() => null);
  refreshSite();
  back("/admin/categories", "msg", "Category deleted. Its products are now uncategorised.");
}

/* ---------------- Gallery ---------------- */

export async function uploadGallery(fd: FormData) {
  await requireAdmin();
  const files = validFiles(fd.getAll("images"));
  if (files.length === 0) back("/admin/gallery", "error", "Please choose at least one image.");
  const title = str(fd, "title", 150);
  const category = str(fd, "category", 60) || "General";
  let n = 0;
  try {
    for (const f of files) {
      const url = await saveImage(f, "gallery");
      await prisma.galleryImage.create({ data: { url, title: files.length > 1 && title ? `${title} ${n + 1}` : title, category } });
      n++;
    }
  } catch (e) {
    refreshSite();
    back("/admin/gallery", "error", `${n} uploaded. ${(e as Error).message}`);
  }
  refreshSite();
  back("/admin/gallery", "msg", `${n} image${n === 1 ? "" : "s"} uploaded.`);
}

export async function updateGalleryImage(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  await prisma.galleryImage.update({
    where: { id },
    data: { title: str(fd, "title", 150), category: str(fd, "category", 60) || "General", sortOrder: Number(fd.get("sortOrder")) || 0 },
  });
  refreshSite();
  back("/admin/gallery", "msg", "Image details saved.");
}

export async function deleteGalleryImage(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const img = await prisma.galleryImage.findUnique({ where: { id } });
  if (img) {
    await prisma.galleryImage.delete({ where: { id } });
    await deleteImage(img.url);
  }
  refreshSite();
  back("/admin/gallery", "msg", "Image deleted.");
}

/* ---------------- Enquiries ---------------- */

const STATUSES = ["NEW", "IN_PROGRESS", "RESOLVED"];

export async function updateEnquiry(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const status = String(fd.get("status"));
  const data: { status?: string; notes?: string } = {};
  if (STATUSES.includes(status)) data.status = status;
  if (fd.has("notes")) data.notes = str(fd, "notes", 5000);
  await prisma.enquiry.update({ where: { id }, data });
  revalidatePath("/admin", "layout");
  const ret = str(fd, "return", 200);
  back(ret.startsWith("/admin") ? ret : `/admin/enquiries/${id}`, "msg", "Enquiry updated.");
}

export async function deleteEnquiry(fd: FormData) {
  await requireAdmin();
  await prisma.enquiry.delete({ where: { id: Number(fd.get("id")) } }).catch(() => null);
  revalidatePath("/admin", "layout");
  back("/admin/enquiries", "msg", "Enquiry deleted.");
}

/* ---------------- Settings ---------------- */

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  const keys = Object.keys(DEFAULT_SETTINGS) as SettingKey[];
  const ops = keys
    .filter((k) => fd.has(k))
    .map((k) => {
      const value = str(fd, k, 10000);
      return prisma.setting.upsert({ where: { key: k }, update: { value }, create: { key: k, value } });
    });
  await prisma.$transaction(ops);
  refreshSite();
  back("/admin/settings", "msg", "Website settings saved.");
}
