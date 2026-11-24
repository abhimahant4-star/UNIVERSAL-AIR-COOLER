import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import ProductImages from "@/components/ProductImages";
import EnquiryForm from "@/components/EnquiryForm";
import { WhatsAppIcon } from "@/components/Icons";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatPrice, lines, parseImages, parseSpecs, siteUrl, telLink, whatsappLink } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

async function getProduct(slug: string) {
  return prisma.product.findFirst({ where: { slug, active: true }, include: { category: true } });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Product not found" };
  const img = parseImages(p.images)[0];
  return {
    title: p.metaTitle || p.name,
    description: p.metaDescription || p.shortDescription,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.metaTitle || p.name, description: p.metaDescription || p.shortDescription, images: img ? [img] : undefined },
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const s = await getSettings();
  const images = parseImages(p.images);
  const features = lines(p.features);
  const specs = parseSpecs(p.specs);
  const related = await prisma.product.findMany({
    where: { active: true, id: { not: p.id }, ...(p.categoryId ? { categoryId: p.categoryId } : {}) },
    include: { category: true },
    take: 3,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription,
    image: images.map((i) => `${siteUrl()}${i}`),
    brand: { "@type": "Brand", name: s.siteName },
    category: p.category?.name,
    ...(p.showPrice && p.price != null
      ? { offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: "https://schema.org/InStock" } }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        title={p.name}
        crumbs={[
          { href: "/products", label: "Our Products" },
          ...(p.category ? [{ href: `/products?category=${p.category.slug}`, label: p.category.name }] : []),
          { label: p.name },
        ]}
      />

      <section className="py-12 sm:py-16">
        <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductImages images={images} name={p.name} />
          <div>
            {p.category && <p className="eyebrow">{p.category.name}</p>}
            <h2 className="mt-2 text-3xl font-extrabold">{p.name}</h2>
            <p className="mt-4 text-lg text-slate-600">{p.shortDescription}</p>
            <p className="mt-5 text-2xl font-extrabold text-brand-700">{p.showPrice && p.price != null ? formatPrice(p.price) : "Price on request"}</p>
            {p.showPrice && p.price != null && <p className="text-xs text-slate-500">Inclusive of all taxes. Prices may vary by location.</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#enquiry" className="btn-primary px-6 py-3">
                Send Enquiry
              </a>
              <a href={whatsappLink(s.whatsapp, `Hello, I am interested in ${p.name}. Please share more details.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-6 py-3">
                <WhatsAppIcon /> Ask on WhatsApp
              </a>
              <a href={telLink(s.phone)} className="btn-outline px-6 py-3">
                <Phone className="h-4 w-4" /> Call
              </a>
              <Link href="/catalogues" className="btn-outline px-6 py-3">
                <Download className="h-4 w-4" /> Catalogue
              </Link>
            </div>

            {features.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold">Key Features</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="container-x mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            {p.description && (
              <>
                <h3 className="text-xl font-bold">Product Description</h3>
                <div className="prose-text mt-3 text-slate-600">
                  {p.description.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </>
            )}
            {specs.pairs.length > 0 && (
              <>
                <h3 className="mt-8 text-xl font-bold">Specifications</h3>
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.pairs.map((sp, i) => (
                        <tr key={i} className="odd:bg-slate-50">
                          <th scope="row" className="w-1/2 px-4 py-3 text-left font-semibold text-slate-800">
                            {sp.label}
                          </th>
                          <td className="px-4 py-3 text-slate-600">{sp.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          <div id="enquiry" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold">Enquire about this product</h3>
            <p className="mt-1 mb-5 text-sm text-slate-500">Share your details and we will get back to you with price and availability.</p>
            <EnquiryForm productId={p.id} productName={p.name} compact />
          </div>
        </div>

        {specs.table.length > 1 && (
          <div className="container-x mt-12">
            <h3 className="text-xl font-bold">Models &amp; Technical Data</h3>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-brand-700 text-left text-white">
                  <tr>
                    {specs.table[0].map((h, i) => (
                      <th key={i} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.table.slice(1).map((row, r) => (
                    <tr key={r} className="odd:bg-slate-50">
                      {row.map((c, i) =>
                        i === 0 ? (
                          <th key={i} scope="row" className="px-4 py-3 text-left font-semibold whitespace-nowrap text-slate-800">
                            {c}
                          </th>
                        ) : (
                          <td key={i} className="px-4 py-3 whitespace-nowrap text-slate-600">
                            {c}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold">Related Products</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ProductCard key={r.id} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
