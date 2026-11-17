"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, FolderTree, Images, LayoutDashboard, LogOut, Menu, MessageSquare, Package, Settings, X } from "lucide-react";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/settings", label: "Website Settings", icon: Settings },
];

export default function AdminShell({ children, name, newEnquiries }: { children: React.ReactNode; name: string; newEnquiries: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-950 text-slate-300">
      <div className="flex items-center gap-2.5 px-5 py-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-sm.webp" alt="Logo" width={480} height={317} className="h-10 w-auto rounded-md" />
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-white">UNIVERSAL AIR COOLER</p>
          <p className="text-[11px] text-slate-400">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${active(n.href) ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"}`}
          >
            <n.icon className="h-4.5 w-4.5" />
            <span className="flex-1">{n.label}</span>
            {n.href === "/admin/enquiries" && newEnquiries > 0 && <span className="rounded-full bg-ice px-2 py-0.5 text-xs font-bold text-brand-950">{newEnquiries}</span>}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4.5 w-4.5" /> View Website
        </a>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-white">
            <LogOut className="h-4.5 w-4.5" /> Log out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <p className="hidden text-sm text-slate-500 lg:block">Manage your website content</p>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{name.slice(0, 1).toUpperCase()}</span>
            <span className="hidden text-sm font-semibold text-slate-800 sm:block">{name}</span>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
