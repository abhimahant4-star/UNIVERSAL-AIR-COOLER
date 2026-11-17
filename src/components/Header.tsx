"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, Snowflake, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Our Products" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header({ siteName, phone, tel }: { siteName: string; phone: string; tel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteName} home`}>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-ice text-white shadow-md">
            <Snowflake className="h-6 w-6" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight whitespace-nowrap text-slate-900 sm:text-lg">{siteName.toUpperCase()}</span>
            <span className="block text-[11px] font-medium text-slate-500">Cooling Solutions</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition xl:px-4 ${
                isActive(n.href) ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:text-brand-700"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={tel} className="hidden items-center gap-2 text-sm font-semibold whitespace-nowrap text-slate-800 hover:text-brand-700 xl:flex">
            <Phone className="h-4 w-4 text-brand-600" /> {phone}
          </a>
          <Link href="/contact#enquiry" className="btn-primary whitespace-nowrap">
            Get a Quote
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
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
