import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PageHero({ title, subtitle, crumbs }: { title: string; subtitle?: string; crumbs: { href?: string; label: string }[] }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
      <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-ice/20 blur-3xl" />
      <div className="container-x relative py-14 sm:py-20">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-brand-200">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-extrabold text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-brand-100 sm:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
