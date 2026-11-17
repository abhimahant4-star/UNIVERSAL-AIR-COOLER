import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Star } from "lucide-react";
import { ConfirmButton } from "@/components/admin/ui";
import { CoolerArt } from "@/components/Icons";
import { prisma } from "@/lib/db";
import { formatPrice, oid, parseImages } from "@/lib/utils";
import { deleteProduct, toggleProduct } from "../../actions";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "" } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const products = await prisma.product.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
      ...(category ? { categoryId: oid(category) ?? "000000000000000000000000" } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Products</h1>
          <p className="text-sm text-slate-500">Add, edit and remove the products shown on your website.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <input name="q" defaultValue={q} placeholder="Search by name…" className="input max-w-xs" />
        <select name="category" defaultValue={category} className="input max-w-xs">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="btn-outline">Filter</button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
            )}
            {products.map((p) => {
              const img = parseImages(p.images)[0];
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <CoolerArt className="h-12 w-12 rounded-lg" />
                      )}
                      <div>
                        <Link href={`/admin/products/${p.id}`} className="font-semibold text-slate-900 hover:text-brand-700">
                          {p.name}
                        </Link>
                        <p className="text-xs text-slate-400">/products/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.price != null ? formatPrice(p.price) : "—"}
                    {p.price != null && !p.showPrice && <span className="block text-xs text-slate-400">hidden</span>}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="featured" />
                      <button title="Toggle featured" className={p.featured ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}>
                        <Star className="h-5 w-5" fill={p.featured ? "currentColor" : "none"} />
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="active" />
                      <button title="Toggle visibility" className={p.active ? "text-emerald-600" : "text-slate-400"}>
                        {p.active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/products/${p.id}`} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50">
                        <Pencil className="h-4 w-4" /> Edit
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton message={`Delete "${p.name}"? This cannot be undone.`}>Delete</ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
