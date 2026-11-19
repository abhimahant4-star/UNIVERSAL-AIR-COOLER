import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";
import { exhibitionPhotos, toGridImages } from "@/lib/gallery";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Exhibition Participation",
    description: `${s.siteName} at trade fairs and industrial exhibitions: our stalls, product displays and live demonstrations.`,
    alternates: { canonical: "/exhibitions" },
  };
}

export default async function ExhibitionsPage() {
  const images = await exhibitionPhotos();
  return (
    <>
      <PageHero
        title="Exhibition Participation"
        subtitle="Meet us at trade fairs and industrial exhibitions, where we showcase our latest air coolers and ventilation systems."
        crumbs={[{ label: "Exhibition Participation" }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <h2 className="sr-only">Exhibition photos</h2>
          {images.length > 0 ? (
            <GalleryGrid images={toGridImages(images)} />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center sm:p-14">
              <p className="text-lg font-bold text-slate-800">Exhibition photos are coming soon.</p>
              <p className="mt-2 text-slate-500">Want to know where you can see our coolers next? Get in touch with our team.</p>
              <Link href="/contact#enquiry" className="btn-primary mt-6">
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
