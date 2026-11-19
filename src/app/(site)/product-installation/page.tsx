import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";
import { installationPhotos, toGridImages } from "@/lib/gallery";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Product Installation",
    description: `Photos of ${s.siteName} industrial air coolers, ducting and ventilation systems installed at factories, warehouses and commercial sites.`,
    alternates: { canonical: "/product-installation" },
  };
}

export default async function ProductInstallationPage() {
  const images = await installationPhotos();
  return (
    <>
      <PageHero
        title="Product Installation"
        subtitle="Our industrial coolers, ducting and ventilation systems installed and running at factories, warehouses and commercial sites."
        crumbs={[{ label: "Product Installation" }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <h2 className="sr-only">Installation photos</h2>
          <GalleryGrid images={toGridImages(images)} />
        </div>
      </section>
    </>
  );
}
