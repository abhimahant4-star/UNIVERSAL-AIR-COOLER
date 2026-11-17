import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { prisma } from "@/lib/db";
import { deleteCategory, saveCategory } from "../../actions";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Categories</h1>
        <p className="text-sm text-slate-500">Group your products. Categories appear as filters on the Products page.</p>
      </div>

      <form action={saveCategory} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_2fr_100px_auto] md:items-end">
        <div>
          <label className="label">New category name *</label>
          <input name="name" required className="input" placeholder="e.g. Window Coolers" />
        </div>
        <div>
          <label className="label">Description</label>
          <input name="description" className="input" />
        </div>
        <div>
          <label className="label">Order</label>
          <input name="sortOrder" type="number" defaultValue={categories.length + 1} className="input" />
        </div>
        <SubmitButton>Add Category</SubmitButton>
      </form>

      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <form action={saveCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_2fr_90px_auto] md:items-end">
              <input type="hidden" name="id" value={c.id} />
              <div>
                <label className="label text-xs">Name</label>
                <input name="name" required defaultValue={c.name} className="input" />
              </div>
              <div>
                <label className="label text-xs">Slug</label>
                <input name="slug" defaultValue={c.slug} className="input" />
              </div>
              <div>
                <label className="label text-xs">Description</label>
                <input name="description" defaultValue={c.description} className="input" />
              </div>
              <div>
                <label className="label text-xs">Order</label>
                <input name="sortOrder" type="number" defaultValue={c.sortOrder} className="input" />
              </div>
              <SubmitButton className="btn-outline">Save</SubmitButton>
            </form>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{c._count.products} products</span>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmButton message={`Delete category "${c.name}"? Its products will become uncategorised.`}>Delete</ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
