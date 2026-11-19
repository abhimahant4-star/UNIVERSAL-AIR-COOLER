import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import Clients from "@/components/Clients";
import { getSettings } from "@/lib/settings";
import { telLink } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "Our Prestigious Customers",
    description: `Leading manufacturers, industries and hospitality brands that trust ${s.siteName} for cooling and ventilation.`,
    alternates: { canonical: "/customers" },
  };
}

export default async function CustomersPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero
        title="Our Prestigious Customers"
        subtitle="Leading industries, manufacturers and hospitality brands rely on our cooling and ventilation systems."
        crumbs={[{ label: "Our Prestigious Customers" }]}
      />
      <Clients list={s.clients} />
      <section className="pb-20">
        <div className="container-x">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-ice px-6 py-10 text-center text-white sm:px-12">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Join our growing list of satisfied customers</h2>
            <p className="mt-2 text-brand-50">Tell us about your site and we will recommend the right cooling solution.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={telLink(s.phone)} className="btn-light px-6 py-3">
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <Link href="/contact#enquiry" className="btn border border-white/60 px-6 py-3 text-white hover:bg-white/10">
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
