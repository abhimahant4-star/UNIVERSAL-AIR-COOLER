"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Menu, Phone, X } from "lucide-react";
import { NAV } from "@/lib/nav";

export default function Header({ siteName, phone, tel }: { siteName: string; phone: string; tel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between gap-3 lg:h-24">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" aria-label={`${siteName} home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-light-sm.webp" alt={`${siteName} logo`} width={600} height={321} className="h-14 w-auto shrink-0 lg:h-[76px]" />
          <span className="hidden leading-tight sm:block xl:hidden 2xl:block">
            <span className="block text-lg font-extrabold tracking-tight whitespace-nowrap text-slate-900">{siteName.toUpperCase()}</span>
            <span className="block text-[11px] font-medium text-slate-500">An ISO 9001:2015 Company</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-2.5 py-2 text-[13.5px] font-semibold 2xl:px-3 whitespace-nowrap transition ${
                isActive(n.href) ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:text-brand-700"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            href="/catalogues"
            title="Download Catalogues"
            aria-label="Download Catalogues"
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${
              isActive("/catalogues") ? "border-brand-300 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            <Download className="h-[18px] w-[18px]" />
          </Link>
          <Link href="/contact#enquiry" className="btn-primary whitespace-nowrap">
            Get a Quote
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <a href={tel} className="hidden items-center gap-2 text-sm font-semibold whitespace-nowrap text-slate-800 hover:text-brand-700 md:flex">
            <Phone className="h-4 w-4 text-brand-600" /> {phone}
          </a>
          <button
            className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-slate-200 bg-white xl:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Mobile">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-3 text-base font-semibold ${isActive(n.href) ? "bg-brand-50 text-brand-700" : "text-slate-800"}`}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/catalogues"
              className={`flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold ${isActive("/catalogues") ? "bg-brand-50 text-brand-700" : "text-brand-700"}`}
            >
              <Download className="h-5 w-5" /> Download Catalogues
            </Link>
            <div className="mt-3 flex gap-3 px-1 pb-2">
              <a href={tel} className="btn-outline flex-1">
                <Phone className="h-4 w-4" /> Call
              </a>
              <Link href="/contact#enquiry" className="btn-primary flex-1">
                Get a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
