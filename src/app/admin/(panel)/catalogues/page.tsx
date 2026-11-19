import Link from "next/link";
import { Download, ExternalLink, FileText } from "lucide-react";
import CatalogueUploader from "@/components/admin/CatalogueUploader";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { prisma } from "@/lib/db";
import { catalogueUrl, formatBytes } from "@/lib/catalogue";
import { formatDate } from "@/lib/utils";
import { deleteCatalogue, updateCatalogue } from "../../catalogue-actions";

export default async function AdminCatalogues() {
  const list = await prisma.catalogue.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Catalogues</h1>
          <p className="text-sm text-slate-500">PDF catalogues that customers can view and download on the Download Catalogues page.</p>
        </div>
        <Link href="/catalogues" target="_blank" className="btn-outline">
          <ExternalLink className="h-4 w-4" /> View on website
        </Link>
      </div>

      <CatalogueUploader />

      <div>
        <h2 className="mb-3 font-bold">Your catalogues ({list.length})</h2>
        {list.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No catalogues yet. Upload your first PDF above.</p>
        ) : (
          <div className="space-y-4">
            {list.map((c) => (
              <div key={c.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[120px_1fr] sm:p-5">
                <div className="mx-auto w-28 sm:w-full">
                  {c.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverUrl} alt="" className="aspect-[3/4] w-full rounded-lg border border-slate-200 bg-slate-50 object-cover" />
                  ) : (
                    <div className="grid aspect-[3/4] w-full place-items-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-500 text-white">
                      <FileText className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    {!c.ready ? (
                      <span className="rounded-full bg-red-50 px-2.5 py-0.5 font-semibold text-red-700">Upload incomplete: delete and upload again</span>
                    ) : c.visible ? (
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 font-semibold text-green-700">Visible on website</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-600">Hidden</span>
                    )}
                    <span>{c.fileName}</span>
                    <span>{formatBytes(c.size)}</span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" /> {c.downloads} views/downloads
                    </span>
                    <span>Added {formatDate(c.createdAt)}</span>
                    {c.ready && (
                      <a href={catalogueUrl(c.slug)} target="_blank" className="font-semibold text-brand-700 hover:underline">
                        Open PDF
                      </a>
                    )}
                  </div>
                  <form action={updateCatalogue} className="grid gap-3 md:grid-cols-2">
                    <input type="hidden" name="id" value={c.id} />
                    <div>
                      <label className="label">Title</label>
                      <input name="title" defaultValue={c.title} maxLength={150} className="input py-1.5" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-24">
                        <label className="label">Order</label>
                        <input name="sortOrder" type="number" defaultValue={c.sortOrder} className="input py-1.5" />
                      </div>
                      <label className="mt-7 flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <input type="checkbox" name="visible" defaultChecked={c.visible} className="h-4 w-4" /> Show on website
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="label">Description</label>
                      <textarea name="description" defaultValue={c.description} rows={2} maxLength={600} className="input py-1.5" />
                    </div>
                    <div>
                      <label className="label">Change cover image</label>
                      <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="input py-1.5" />
                    </div>
                    {c.coverUrl && (
                      <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-600">
                        <input type="checkbox" name="removeCover" className="h-4 w-4" /> Remove cover image
                      </label>
                    )}
                    <div className="md:col-span-2">
                      <SubmitButton className="btn-outline py-1.5">Save changes</SubmitButton>
                    </div>
                  </form>
                  <form action={deleteCatalogue} className="mt-3 border-t border-slate-100 pt-3 text-right">
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmButton message={`Delete "${c.title}"? Customers will no longer be able to download it. This cannot be undone.`}>Delete catalogue</ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500">To replace a PDF with a newer version, upload the new file and then delete the old catalogue.</p>
    </div>
  );
}
