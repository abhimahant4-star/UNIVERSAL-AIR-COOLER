"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { oid } from "@/lib/utils";

export type EnquiryState = { ok: boolean; message: string; errors?: Record<string, string> };

const recent = new Map<string, number[]>();

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: real visitors never fill this hidden field.
  if (String(formData.get("website") || "").trim()) return { ok: true, message: "Thank you! We will contact you shortly." };

  const get = (k: string, max: number) => String(formData.get(k) || "").trim().slice(0, max);
  const name = get("name", 100);
  const phone = get("phone", 20);
  const email = get("email", 120);
  const city = get("city", 80);
  const subject = get("subject", 150);
  const message = get("message", 3000);
  const productId = oid(formData.get("productId"));

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^[+\d][\d\s-]{6,18}$/.test(phone)) errors.phone = "Please enter a valid phone number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (message.length < 5) errors.message = "Please tell us a little about your requirement.";
  if (Object.keys(errors).length) return { ok: false, message: "Please correct the highlighted fields.", errors };

  // Basic flood protection: max 5 enquiries per phone number per 10 minutes.
  const now = Date.now();
  const hits = (recent.get(phone) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (hits.length >= 5) return { ok: false, message: "Too many enquiries. Please try again later or call us directly." };
  recent.set(phone, [...hits, now]);

  const product = productId ? await prisma.product.findUnique({ where: { id: productId }, select: { id: true } }) : null;
  await prisma.enquiry.create({ data: { name, phone, email, city, subject, message, productId: product?.id ?? null } });
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  return { ok: true, message: "Thank you! Your enquiry has been received. Our team will contact you shortly." };
}
