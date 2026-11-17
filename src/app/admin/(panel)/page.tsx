import Link from "next/link";
import { ArrowRight, FolderTree, Images, MessageSquare, Package, Plus, Upload } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function Dashboard() {
  const [products, activeProducts, categories, gallery, enquiries, newEnq, recent] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.category.count(),
    prisma.galleryImage.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { product: { select: { name: true } } } }),
  ]);

  const cards = [
    { label: "Products", value: products, sub: `${activeProducts} visible on website`, icon: Package, href: "/admin/products", color: "bg-brand-50 text-brand-600" },
    { label: "Categories", value: categories, sub: "Product categories", icon: FolderTree, href: "/admin/categories", color: "bg-violet-50 text-violet-600" },
    { label: "Gallery Images", value: gallery, sub: "Shown on Gallery page", icon: Images, href: "/admin/gallery", color: "bg-teal-50 text-teal-600" },
    { label: "Enquiries", value: enquiries, sub: `${newEnq} new`, icon: MessageSquare, href: "/admin/enquiries", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="text-sm text-slate-500">Overview of your website content and customer enquiries.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="btn-primary">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
          <Link href="/admin/gallery" className="btn-outline">
            <Upload className="h-4 w-4" /> Upload Images
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">{c.label}</p>
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-semibold text-brand-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No enquiries yet. They will appear here when customers submit the contact form.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-slate-50">
                  <span className="min-w-40 font-semibold text-slate-900">{e.name}</span>
                  <span className="text-sm text-slate-600">{e.phone}</span>
                  <span className="flex-1 truncate text-sm text-slate-500">{e.product?.name || e.subject || e.message}</span>
                  <StatusBadge status={e.status} />
                  <span className="text-xs text-slate-400">{formatDate(e.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
