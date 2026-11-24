import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import EnquiryForm from "@/components/EnquiryForm";
import { WhatsAppIcon } from "@/components/Icons";
import SocialLinks, { socialList } from "@/components/SocialLinks";
import { directionsUrl, getSettings, mapSrc } from "@/lib/settings";
import { telLink, whatsappLink } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Contact Us",
    description: `Contact ${s.siteName} for air cooler prices, dealership and bulk orders. Call ${[s.phone, s.phone2].filter(Boolean).join(" / ")} or send an enquiry online.`,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const s = await getSettings();
  const map = mapSrc(s.mapEmbedUrl);

  const cards: { icon: typeof Phone; title: string; items: { value: string; href?: string }[] }[] = [
    { icon: Phone, title: "Call Us", items: [s.phone, s.phone2].filter(Boolean).map((p) => ({ value: p, href: telLink(p) })) },
    { icon: Mail, title: "Email Us", items: [{ value: s.email, href: `mailto:${s.email}` }] },
    { icon: MapPin, title: "Visit Us", items: [{ value: s.address }] },
    { icon: Clock, title: "Business Hours", items: [{ value: s.businessHours }] },
  ];

  return (
    <>
      <PageHero title="Contact Us" subtitle="Have a question, need a quote or want to become a dealer? We are happy to help." crumbs={[{ label: "Contact Us" }]} />

      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-200 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <c.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-bold">{c.title}</h2>
              {c.items.map((it) =>
                it.href ? (
                  <a key={it.value} href={it.href} className="mt-1 block text-sm break-words text-slate-600 hover:text-brand-700">
                    {it.value}
                  </a>
                ) : (
                  <p key={it.value} className="mt-1 text-sm whitespace-pre-line text-slate-600">
                    {it.value}
                  </p>
                ),
              )}
            </div>
          ))}
        </div>

        <div className="container-x mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div id="enquiry" className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
            <p className="eyebrow">Enquiry Form</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Send Us an Enquiry</h2>
            <p className="mt-2 mb-6 text-sm text-slate-500">Fill in the form and our team will contact you within one business day.</p>
            <EnquiryForm />
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-[#25D366] p-8 text-white">
              <WhatsAppIcon className="h-10 w-10" />
              <h2 className="mt-4 text-2xl font-extrabold text-white">Chat on WhatsApp</h2>
              <p className="mt-2 text-white/90">Get instant replies about prices, models and availability.</p>
              <a
                href={whatsappLink(s.whatsapp, `Hello ${s.siteName}, I have an enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-5 bg-white px-6 py-3 text-[#128C7E] hover:bg-white/90"
              >
                <WhatsAppIcon /> Start Chat
              </a>
            </div>
            {socialList(s).length > 0 && (
              <div className="rounded-3xl bg-brand-950 p-6 text-slate-200">
                <h2 className="text-lg font-bold text-white">Follow Us</h2>
                <p className="mt-1 text-sm text-slate-400">See our latest products and installations.</p>
                <SocialLinks s={s} className="mt-4" />
              </div>
            )}
            <div className="min-h-[320px] flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
              {map ? (
                <iframe src={map} title={`${s.siteName} location on Google Maps`} className="h-full min-h-[320px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              ) : (
                <p className="p-8 text-sm text-slate-500">Map not configured.</p>
              )}
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center"
            >
              <MapPin className="h-4 w-4" /> Get Directions to Our Factory
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
