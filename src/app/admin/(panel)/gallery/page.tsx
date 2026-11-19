import { Upload } from "lucide-react";
import { ConfirmButton, ImagePicker, SubmitButton } from "@/components/admin/ui";
import { prisma } from "@/lib/db";
import { EXHIBITION_CATEGORY } from "@/lib/gallery";
import { deleteGalleryImage, updateGalleryImage, uploadGallery } from "../../actions";

export default async function AdminGallery() {
  const images = await prisma.galleryImage.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  const categories = Array.from(new Set(["Projects", EXHIBITION_CATEGORY, "Products", "Ducting", ...images.map((i) => i.category)]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Gallery</h1>
        <p className="text-sm text-slate-500">
          Photos with the category <strong>{EXHIBITION_CATEGORY}</strong> appear on the Exhibition Participation page. All other photos appear on the Product Installation page.
        </p>
      </div>

      <form action={uploadGallery} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-bold">
          <Upload className="h-5 w-5 text-brand-600" /> Upload new images
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Title / caption</label>
            <input name="title" className="input" placeholder="e.g. New showroom display" />
          </div>
          <div>
            <label className="label">Category</label>
            <input name="category" list="gallery-cats" defaultValue="Products" className="input" />
            <datalist id="gallery-cats">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="mt-4">
          <ImagePicker name="images" />
        </div>
        <SubmitButton className="btn-primary mt-5" pendingText="Uploading…">
          Upload Images
        </SubmitButton>
      </form>

      <div>
        <h2 className="mb-3 font-bold">Existing images ({images.length})</h2>
        {images.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No images yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.title} className="aspect-[4/3] w-full object-cover" />
                <form action={updateGalleryImage} className="space-y-2 p-3">
                  <input type="hidden" name="id" value={img.id} />
                  <input name="title" defaultValue={img.title} placeholder="Title" className="input py-1.5" />
                  <div className="flex gap-2">
                    <input name="category" list="gallery-cats" defaultValue={img.category} className="input py-1.5" />
                    <input name="sortOrder" type="number" defaultValue={img.sortOrder} title="Display order" className="input w-20 py-1.5" />
                  </div>
                  <SubmitButton className="btn-outline w-full py-1.5">Save</SubmitButton>
                </form>
                <form action={deleteGalleryImage} className="border-t border-slate-100 px-3 py-2 text-right">
                  <input type="hidden" name="id" value={img.id} />
                  <ConfirmButton message="Delete this image? This cannot be undone.">Delete image</ConfirmButton>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
