import { prisma } from "@/lib/db";

/** Gallery photos whose category is "Exhibition" go to the Exhibition Participation page; all others to Product Installation. */
export const EXHIBITION_CATEGORY = "Exhibition";

const isExhibition = { category: { equals: EXHIBITION_CATEGORY, mode: "insensitive" as const } };
const order = [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }];

export function installationPhotos(take?: number) {
  return prisma.galleryImage.findMany({ where: { NOT: isExhibition }, orderBy: order, take });
}

export function exhibitionPhotos() {
  return prisma.galleryImage.findMany({ where: isExhibition, orderBy: order });
}

export const toGridImages = (images: { id: string; url: string; title: string; category: string }[]) =>
  images.map(({ id, url, title, category }) => ({ id, url, title, category }));
