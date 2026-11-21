import Link from "next/link";
import { ArrowRight, BadgeCheck, Download, Droplets, IndianRupee, Phone, ShieldCheck, Truck, Wind, Zap } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Clients from "@/components/Clients";
import { LogoMark, WhatsAppIcon } from "@/components/Icons";
import CountUp from "@/components/CountUp";
import { installationPhotos } from "@/lib/gallery";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { lines, telLink, whatsappLink } from "@/lib/utils";

export default async function HomePage() {
  const s = await getSettings();
  const [featured, categories, gallery] = await Promise.all([
    prisma.product.findMany({ where: { active: true, featured: true }, include: { category: true }, orderBy: { updatedAt: "desc" }, take: 6 }),
    prisma.category.findMany({ where: { products: { some: { active: true } } }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: { where: { active: true } } } } } }),
    installationPhotos(4),
  ]);

  // "... Since 1980" is shown on its own smaller line under the main heading
  const sinceMatch = s.heroTitle.match(/^(.*?)\s*((?:since|established|estd\.?)\s+\d{4})\s*$/i);
  const heroMain = sinceMatch ? sinceMatch[1] : s.heroTitle;
  const heroSince = sinceMatch ? sinceMatch[2] : "";

  const stats = [
    { value: s.yearsExperience, label: "Years of Experience" },
    { value: s.happyCustomers, label: "Happy Customers" },
    { value: s.productsCount, label: "Cooler Models" },
    { value: s.dealers, label: "Dealers & Partners" },
  ];

  const highlights = [
    { icon: BadgeCheck, title: "Since 1980", text: "Decades of experience designing and developing evaporative cooling systems." },
    { icon: Droplets, title: "High Saturation Efficiency", text: "Cellulose honeycomb pads and air washer systems deliver efficient, consistent cooling." },
    { icon: Zap, title: "Low Energy Consumption", text: "Powerful cooling at a fraction of the running cost of air conditioning." },
    { icon: ShieldCheck, title: "Sturdy & Durable", text: "Precision engineered from premium grade raw material for trouble-free performance." },
    { icon: Wind, title: "Complete Solutions", text: "Coolers, air washers, blowers, ducting, exhaust fans, ventilation systems and chillers." },
    { icon: IndianRupee, title: "Cost Effective", text: "Elegant looks and sturdy construction at excellent value for money." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
        <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-ice/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 pt-8 pb-16 sm:py-24 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-100">
              <BadgeCheck className="h-4 w-4 text-ice" /> {s.tagline}
            </span>
            <h1 className="mt-6 text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl">
              {heroMain}
              {heroSince && <span className="mt-2 block text-xl font-bold tracking-wide text-ice sm:text-2xl lg:text-3xl">{heroSince}</span>}
            </h1>
            <p className="mt-6 max-w-xl text-base text-brand-100 sm:text-lg">{s.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn-light px-6 py-3">
                Explore Products <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact#enquiry" className="btn border border-white/40 px-6 py-3 text-white hover:bg-white/10">
                Send Enquiry
              </Link>
              <a href={whatsappLink(s.whatsapp, "Hello, I am interested in your air coolers.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-6 py-3">
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </div>
          {/* On phones the product photo comes first */}
          <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-lg">
            <div className="absolute inset-6 rounded-[2.5rem] bg-ice/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-products.jpg" alt={`${s.siteName} industrial air coolers, duct coolers and portable coolers`} width={1296} height={1400} fetchPriority="high" className="h-auto w-full" />
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl bg-white px-5 py-3 text-slate-900 shadow-xl sm:-left-8">
              <CountUp value={s.happyCustomers} className="block text-2xl font-extrabold text-brand-700 tabular-nums" />
              <p className="text-xs font-medium text-slate-500">Happy customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {stats.map((st) => (
            <div key={st.label} className="text-center">
              <CountUp value={st.value} className="block text-3xl font-extrabold text-brand-700 tabular-nums sm:text-4xl" />
              <p className="mt-1 text-sm text-slate-500">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 sm:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* The Universal logo is printed on this cooler, so no corner logo here */}
              <img src="/images/grey-cooler.jpg" alt="Star Universal commercial air cooler" width={900} height={988} loading="lazy" className="block h-auto w-full rounded-3xl border border-slate-200 bg-white shadow-sm" />
            </div>
            <div className="relative mt-10 self-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/industrial.jpg" alt="Universal industrial air cooler" width={900} height={900} loading="lazy" className="block aspect-square w-full rounded-3xl border border-slate-200 bg-white object-contain p-3 shadow-sm" />
              <LogoMark />
            </div>
          </div>
          <div>
            <p className="eyebrow">About {s.siteName}</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">The Leaders in Evaporative Air Cooling</h2>
            <p className="mt-5 text-slate-600">{s.aboutShort}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Manufacturing since 1980", "Premium grade raw material", "Low energy consumption", "Industrial & domestic solutions"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <BadgeCheck className="h-5 w-5 text-brand-600" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn-primary mt-8">
              Know More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="container-x">
            <div className="text-center">
              <p className="eyebrow">Product Range</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Cooling Solutions for Every Need</h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((c) => (
                <Link key={c.id} href={`/products?category=${c.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-400 hover:shadow-lg">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                    <Wind className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-bold">{c.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{c._count.products} products</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Featured Products</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Our Best-Selling Air Coolers</h2>
            </div>
            <Link href="/products" className="btn-outline">
              View All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-brand-950 py-16 text-white sm:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-ice uppercase">Why Choose Us</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Key Business Highlights</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h) => (
              <div key={h.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h.icon className="h-8 w-8 text-ice" />
                <h3 className="mt-4 text-lg font-bold text-white">{h.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="container-x text-center">
          <p className="eyebrow">Areas of Application</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Wherever Cooling &amp; Ventilation Is Required</h2>
          <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2.5">
            {lines(s.industries).map((item) => (
              <li key={item} className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-800">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Clients list={s.clients} />

      {/* Product installation teaser */}
      {gallery.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="container-x">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Product Installation</p>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Our Coolers at Work</h2>
              </div>
              <Link href="/product-installation" className="btn-outline">
                View Installations <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {gallery.map((g) => (
                <Link key={g.id} href="/product-installation" className="overflow-hidden rounded-2xl bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt={g.title || "Installation photo"} loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition duration-500 hover:scale-105" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pb-20">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-ice px-6 py-12 text-white sm:px-12">
            <Truck className="pointer-events-none absolute -right-6 -bottom-6 h-48 w-48 text-white/10" />
            <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Looking for the right cooler or bulk pricing?</h2>
                <p className="mt-2 text-brand-50">Call, WhatsApp or send an enquiry — our team will help you choose the perfect model.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={telLink(s.phone)} className="btn-light px-6 py-3">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <Link href="/contact#enquiry" className="btn border border-white/60 px-6 py-3 text-white hover:bg-white/10">
                  Send Enquiry
                </Link>
                <Link href="/catalogues" className="btn border border-white/60 px-6 py-3 text-white hover:bg-white/10">
                  <Download className="h-4 w-4" /> Download Catalogue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
