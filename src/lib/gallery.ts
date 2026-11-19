import { prisma } from "@/lib/db";

/** Gallery photos whose category is "Exhibition" go to the Exhibition Participation page; all others to Product Installation. */
export const EXHIBITION_CATEGORY = "Exhibition";

export type PhotoSection = "installation" | "exhibition";

/** The two photo sections in the admin panel and the website page each one fills. */
export const PHOTO_SECTIONS: Record<PhotoSection, { title: string; adminPath: string; sitePath: string; intro: string }> = {
  installation: {
    title: "Product Installation",
    adminPath: "/admin/installation",
    sitePath: "/product-installation",
    intro: "Photos of your coolers, ducting and fans installed at customer sites. They appear on the Product Installation page and on the home page.",
  },
  exhibition: {
    title: "Exhibition Participation",
    adminPath: "/admin/exhibitions",
    sitePath: "/exhibitions",
    intro: "Photos from trade fairs and exhibitions. They appear on the Exhibition Participation page.",
  },
};

export const isExhibitionCategory = (c: string) => c.trim().toLowerCase() === EXHIBITION_CATEGORY.toLowerCase();

const isExhibition = { category: { equals: EXHIBITION_CATEGORY, mode: "insensitive" as const } };
const order = [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }];

export function installationPhotos(take?: number) {
  return prisma.galleryImage.findMany({ where: { NOT: isExhibition }, orderBy: order, take });
}

export function exhibitionPhotos() {
  return prisma.galleryImage.findMany({ where: isExhibition, orderBy: order });
}

export function sectionPhotos(section: PhotoSection) {
  return section === "exhibition" ? exhibitionPhotos() : installationPhotos();
}

export const toGridImages = (images: { id: string; url: string; title: string; category: string }[]) =>
  images.map(({ id, url, title, category }) => ({ id, url, title, category }));
