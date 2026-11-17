import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, Eye, Factory, Handshake, Target, Users, Wrench } from "lucide-react";
import PageHero from "@/components/PageHero";
import Clients from "@/components/Clients";
import { CoolerArt } from "@/components/Icons";
import { getSettings } from "@/lib/settings";
import { lines } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "About Us",
    description: `Learn about ${s.siteName} — our business profile, mission and vision as a trusted air cooler manufacturer and supplier.`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const s = await getSettings();
  const paragraphs = s.aboutText.split(/\n\s*\n/).filter(Boolean);

  const profile = [
    { icon: Factory, label: "Nature of Business", value: "Manufacturer & Supplier" },
    { icon: Award, label: "Established 1980", value: "ISO 9001:2015" },
    { icon: Users, label: "Customers Served", value: s.happyCustomers },
    { icon: Handshake, label: "Dealer Network", value: s.dealers },
  ];

  return (
    <>
      <PageHero title="About Us" subtitle={s.aboutShort} crumbs={[{ label: "About Us" }]} />

      <section className="py-16 sm:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Company Introduction</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Who We Are</h2>
            <div className="prose-text mt-5 text-slate-600">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="relative">
            <CoolerArt className="aspect-square w-full rounded-3xl" />
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-brand-600 px-6 py-4 text-white shadow-xl">
              <p className="text-3xl font-extrabold">{s.yearsExperience}</p>
              <p className="text-sm text-brand-100">Years of cooling excellence</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-x">
          <div className="text-center">
            <p className="eyebrow">Business Profile</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{s.siteName} at a Glance</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {profile.map((p) => (
              <div key={p.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <p.icon className="mx-auto h-9 w-9 text-brand-600" />
                <p className="mt-4 text-xl font-extrabold text-slate-900">{p.value}</p>
                <p className="mt-1 text-sm text-slate-500">{p.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: Factory, title: "Precision Engineered", text: "Technically advanced systems manufactured from premium grade raw material for high saturation efficiency." },
              { icon: Wrench, title: "Trouble-Free Performance", text: "Durable, efficient cooling with low energy consumption, built for continuous industrial use." },
              { icon: Handshake, title: "Cost Effective", text: "Preferred by customers for elegant looks, sturdy construction and excellent value for money." },
            ].map((x) => (
              <div key={x.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <x.icon className="h-7 w-7 text-brand-600" />
                <h3 className="mt-3 text-lg font-bold">{x.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{x.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Our Product Range</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Complete Cooling &amp; Ventilation Solutions</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {lines(s.productRange).map((item) => (
                <li key={item} className="flex gap-2.5 rounded-xl border border-slate-200 p-3.5 text-sm font-semibold text-slate-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Where We Serve</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Areas of Application</h2>
            <p className="mt-3 text-sm text-slate-600">Wherever air cooling and ventilation is required.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {lines(s.industries).map((item) => (
                <li key={item} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Clients list={s.clients} className="bg-slate-50" />

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white sm:p-10">
            <Target className="h-10 w-10 text-ice" />
            <h2 className="mt-5 text-2xl font-extrabold text-white">Our Mission</h2>
            <p className="mt-3 text-brand-50">{s.mission}</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-brand-950 to-brand-900 p-8 text-white sm:p-10">
            <Eye className="h-10 w-10 text-ice" />
            <h2 className="mt-5 text-2xl font-extrabold text-white">Our Vision</h2>
            <p className="mt-3 text-brand-50">{s.vision}</p>
          </div>
        </div>
        <div className="container-x mt-12 text-center">
          <Link href="/products" className="btn-primary px-6 py-3">
            Browse Our Products
          </Link>
        </div>
      </section>
    </>
  );
}
