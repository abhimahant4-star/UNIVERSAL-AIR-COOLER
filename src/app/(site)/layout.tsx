export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppIcon } from "@/components/Icons";
import { getSettings } from "@/lib/settings";
import { siteUrl, telLink, whatsappLink } from "@/lib/utils";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: s.siteName,
    description: s.aboutShort,
    url: siteUrl(),
    logo: `${siteUrl()}/logo.webp`,
    image: `${siteUrl()}/images/hero-products.jpg`,
    telephone: [s.phone, s.phone2].filter(Boolean),
    email: s.email,
    foundingDate: "1980",
    address: { "@type": "PostalAddress", streetAddress: s.address.replace(/\s*\n\s*/g, ", "), addressCountry: "IN" },
    openingHours: s.businessHours,
    sameAs: [s.facebook, s.instagram, s.youtube].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header siteName={s.siteName} phone={s.phone} tel={telLink(s.phone)} />
      <main>{children}</main>
      <Footer s={s} />
      <a
        href={whatsappLink(s.whatsapp, `Hello ${s.siteName}, I would like to know more about your air coolers.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed right-4 bottom-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition hover:scale-105 sm:right-6 sm:bottom-6"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </>
  );
}
