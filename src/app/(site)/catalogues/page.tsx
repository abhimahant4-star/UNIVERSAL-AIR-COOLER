import type { Metadata } from "next";
import Link from "next/link";
import { Download, Eye, FileText, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import { WhatsAppIcon } from "@/components/Icons";
import { prisma } from "@/lib/db";
import { catalogueUrl, formatBytes } from "@/lib/catalogue";
import { getSettings } from "@/lib/settings";
import { telLink, whatsappLink } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Download Catalogues",
    description: `Download ${s.siteName} product catalogues and brochures (PDF): industrial coolers, evaporative air cooling systems, fans, ducting and more.`,
    alternates: { canonical: "/catalogues" },
  };
}

export default async function CataloguesPage() {
  const [s, list] = await Promise.all([
    getSettings(),
    prisma.catalogue.findMany({ where: { ready: true, visible: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);

  return (
    <>
      <PageHero
        title="Download Catalogues"
        subtitle="Browse our product catalogues and brochures. View them online or download the PDF to share with your team."
        crumbs={[{ label: "Download Catalogues" }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <h2 className="sr-only">Catalogues</h2>
          {list.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center sm:p-14">
              <p className="text-lg font-bold text-slate-800">Our catalogues will be available here soon.</p>
              <p className="mt-2 text-slate-500">Need one now? Message us on WhatsApp and we will send it to you.</p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((c) => {
                const url = catalogueUrl(c.slug);
                return (
                  <li key={c.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
                    <a href={url} target="_blank" rel="noopener" className="block bg-slate-50" aria-label={`View ${c.title}`}>
                      {c.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.coverUrl} alt={`${c.title} catalogue cover`} loading="lazy" className="aspect-[4/3] w-full object-contain p-3" />
                      ) : (
                        <div className="grid aspect-[4/3] w-full place-items-center bg-gradient-to-br from-brand-800 to-brand-500 text-white">
                          <FileText className="h-16 w-16 opacity-90" />
                        </div>
                      )}
                    </a>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold">{c.title}</h3>
                      {c.description && <p className="mt-2 text-sm text-slate-600">{c.description}</p>}
                      <p className="mt-3 text-xs font-semibold text-slate-500">PDF · {formatBytes(c.size)}</p>
                      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                        <a href={url} target="_blank" rel="noopener" className="btn-outline px-3 py-2.5">
                          <Eye className="h-4 w-4" /> View
                        </a>
                        <a href={`${url}?download=1`} download className="btn-primary px-3 py-2.5">
                          <Download className="h-4 w-4" /> Download
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-3xl bg-slate-50 p-6 text-center sm:flex-row sm:p-8 sm:text-left">
            <div>
              <p className="text-lg font-bold text-slate-900">Need pricing or help choosing a model?</p>
              <p className="mt-1 text-sm text-slate-600">Our team will recommend the right cooler for your space.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={telLink(s.phone)} className="btn-outline">
                <Phone className="h-4 w-4" /> Call
              </a>
              <a href={whatsappLink(s.whatsapp, "Hello, please send me your product catalogue and price list.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <WhatsAppIcon /> WhatsApp
              </a>
              <Link href="/contact#enquiry" className="btn-primary">
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
