import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Snowflake } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/db";
import { telLink } from "@/lib/utils";
import SocialLinks from "./SocialLinks";

export default async function Footer({ s }: { s: SiteSettings }) {
  const categories = await prisma.category.findMany({ where: { products: { some: { active: true } } }, orderBy: { sortOrder: "asc" }, take: 6 });
  const phones = [s.phone, s.phone2].filter(Boolean);

  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-ice text-white">
              <Snowflake className="h-6 w-6" />
            </span>
            <span className="text-lg font-extrabold text-white">{s.siteName.toUpperCase()}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{s.aboutShort}</p>
          <SocialLinks s={s} className="mt-5 text-slate-300" />
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["/", "Home"],
              ["/about", "About Us"],
              ["/products", "Our Products"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact Us"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Product Categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="font-semibold text-ice hover:text-white">
                View all products →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ice" /> <span className="whitespace-pre-line">{s.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ice" />
              <span className="flex flex-col gap-1">
                {phones.map((ph) => (
                  <a key={ph} href={telLink(ph)} className="hover:text-white">
                    {ph}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ice" />
              <a href={`mailto:${s.email}`} className="break-all hover:text-white">
                {s.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ice" /> {s.businessHours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {s.siteName}. All rights reserved.
          </p>
          <p>Evaporative Cooling · Industrial Coolers · Air Washers · Ventilation Systems</p>
        </div>
      </div>
    </footer>
  );
}
