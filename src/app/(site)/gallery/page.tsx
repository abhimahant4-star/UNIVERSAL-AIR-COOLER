import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Gallery",
    description: `Photos of ${s.siteName} products, showroom, installations and business activities.`,
    alternates: { canonical: "/gallery" },
  };
}

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <>
      <PageHero title="Gallery" subtitle="A look at our products, showroom, installations and day-to-day business." crumbs={[{ label: "Gallery" }]} />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <h2 className="sr-only">Product and business images</h2>
          <GalleryGrid images={images.map(({ id, url, title, category }) => ({ id, url, title, category }))} />
        </div>
      </section>
    </>
  );
}
