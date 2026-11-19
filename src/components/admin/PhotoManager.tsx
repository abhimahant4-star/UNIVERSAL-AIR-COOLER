import Link from "next/link";
import { ExternalLink, Upload } from "lucide-react";
import { ConfirmButton, ImagePicker, SubmitButton } from "@/components/admin/ui";
import { PHOTO_SECTIONS, sectionPhotos, type PhotoSection } from "@/lib/gallery";
import { deleteGalleryImage, updateGalleryImage, uploadGallery } from "@/app/admin/actions";

/** Admin screen for one photo section (Product Installation or Exhibition Participation). */
export default async function PhotoManager({ section }: { section: PhotoSection }) {
  const info = PHOTO_SECTIONS[section];
  const images = await sectionPhotos(section);
  const isInstallation = section === "installation";
  const groups = Array.from(new Set(["Projects", "Ducting", "Products", ...images.map((i) => i.category)]));
  const listId = `${section}-groups`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{info.title}</h1>
          <p className="text-sm text-slate-500">{info.intro}</p>
        </div>
        <Link href={info.sitePath} target="_blank" className="btn-outline">
          <ExternalLink className="h-4 w-4" /> View on website
        </Link>
      </div>

      <form action={uploadGallery} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <input type="hidden" name="section" value={section} />
        <h2 className="flex items-center gap-2 font-bold">
          <Upload className="h-5 w-5 text-brand-600" /> Upload new photos
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Caption</label>
            <input name="title" maxLength={150} className="input" placeholder={isInstallation ? "e.g. Industrial coolers at a textile mill" : "e.g. Our stall at the industrial expo"} />
          </div>
          {isInstallation && (
            <div>
              <label className="label">Group (used for the filter buttons on the website)</label>
              <input name="category" list={listId} defaultValue="Projects" maxLength={60} className="input" />
            </div>
          )}
        </div>
        <datalist id={listId}>
          {groups.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <div className="mt-4">
          <ImagePicker name="images" />
        </div>
        <SubmitButton className="btn-primary mt-5" pendingText="Uploading…">
          Upload Photos
        </SubmitButton>
      </form>

      <div>
        <h2 className="mb-3 font-bold">Photos on the website ({images.length})</h2>
        {images.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No photos yet. Upload some above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <form action={updateGalleryImage} className="space-y-2 p-3">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="section" value={section} />
                  <input name="title" defaultValue={img.title} placeholder="Caption" maxLength={150} className="input py-1.5" />
                  <div className="flex gap-2">
                    {isInstallation && <input name="category" list={listId} defaultValue={img.category} title="Group" className="input py-1.5" />}
                    <input name="sortOrder" type="number" defaultValue={img.sortOrder} title="Display order (lower numbers first)" className={`input py-1.5 ${isInstallation ? "w-20" : ""}`} />
                  </div>
                  <SubmitButton className="btn-outline w-full py-1.5">Save</SubmitButton>
                </form>
                <form action={deleteGalleryImage} className="border-t border-slate-100 px-3 py-2 text-right">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="section" value={section} />
                  <ConfirmButton message="Delete this photo? This cannot be undone.">Delete photo</ConfirmButton>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
