import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import { prisma } from "@/lib/db";

type SP = Promise<{ category?: string; q?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { category } = await searchParams;
  const cat = category ? await prisma.category.findUnique({ where: { slug: category } }) : null;
  return {
    title: cat ? `${cat.name} – Our Products` : "Our Products – Air Coolers",
    description: cat?.description || "Browse desert coolers, personal coolers, tower coolers, industrial coolers and genuine spare parts.",
    alternates: { canonical: cat ? `/products?category=${cat.slug}` : "/products" },
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const { category, q } = await searchParams;
  const categories = await prisma.category.findMany({ where: { products: { some: { active: true } } }, orderBy: { sortOrder: "asc" } });
  const active = categories.find((c) => c.slug === category);
  const query = (q || "").trim().slice(0, 80);

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(active ? { categoryId: active.id } : {}),
      ...(query ? { OR: [{ name: { contains: query } }, { shortDescription: { contains: query } }] } : {}),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  const href = (slug?: string) => {
    const p = new URLSearchParams();
    if (slug) p.set("category", slug);
    if (query) p.set("q", query);
    const s = p.toString();
    return s ? `/products?${s}` : "/products";
  };

  return (
    <>
      <PageHero
        title={active ? active.name : "Our Products"}
        subtitle={active?.description || "Explore our complete range of air coolers and cooling products for homes, shops, offices and industries."}
        crumbs={active ? [{ href: "/products", label: "Our Products" }, { label: active.name }] : [{ label: "Our Products" }]}
      />

      <section className="py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <form action="/products" className="relative">
              {active && <input type="hidden" name="category" value={active.slug} />}
              <label htmlFor="q" className="sr-only">
                Search products
              </label>
              <input id="q" name="q" defaultValue={query} placeholder="Search products…" className="input pl-10" />
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </form>
            <div>
              <h2 className="mb-3 text-sm font-bold tracking-wider text-slate-500 uppercase">Categories</h2>
              <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                <Link href={href()} className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold ${!active ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                  All Products
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={href(c.slug)}
                    className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold ${active?.id === c.id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <p className="mb-5 text-sm text-slate-500">
              Showing <strong className="text-slate-800">{products.length}</strong> product{products.length === 1 ? "" : "s"}
              {query && (
                <>
                  {" "}
                  for “<strong className="text-slate-800">{query}</strong>”
                </>
              )}
            </p>
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-slate-600">No products found.</p>
                <Link href="/products" className="btn-outline mt-4">
                  View all products
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
