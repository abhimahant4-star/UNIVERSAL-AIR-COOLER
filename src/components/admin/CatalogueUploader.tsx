"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2 } from "lucide-react";
import { cancelCatalogue, finishCatalogue, startCatalogue } from "@/app/admin/catalogue-actions";
import { CHUNK_SIZE, MAX_PDF_BYTES, chunkCountFor, formatBytes } from "@/lib/catalogue";

/** Uploads a PDF catalogue in ~3.5 MB pieces so any size works on Vercel (4.5 MB request limit). */
export default function CatalogueUploader() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please choose a PDF file.");
    if (file.type && file.type !== "application/pdf") return setError("Only PDF files can be uploaded.");
    if (file.size > MAX_PDF_BYTES) return setError("The PDF is larger than 100 MB. Please compress it and try again.");
    const cover = (e.currentTarget.elements.namedItem("cover") as HTMLInputElement).files?.[0];
    if (cover && cover.size > 4 * 1024 * 1024) return setError("The cover image is larger than 4 MB. Please choose a smaller image.");

    const fd = new FormData(e.currentTarget);
    fd.delete("pdf");
    fd.set("fileName", file.name);
    fd.set("size", String(file.size));
    setProgress(0);

    let id: string | undefined;
    try {
      const start = await startCatalogue(fd);
      if (start.error || !start.id) throw new Error(start.error || "Could not start the upload.");
      id = start.id;
      const total = chunkCountFor(file.size);
      for (let i = 0; i < total; i++) {
        const part = file.slice(i * CHUNK_SIZE, Math.min(file.size, (i + 1) * CHUNK_SIZE));
        let ok = false;
        let message = "";
        for (let attempt = 0; attempt < 3 && !ok; attempt++) {
          const res = await fetch(`/admin/catalogues/${id}/chunks/${i}`, { method: "PUT", body: part, headers: { "Content-Type": "application/octet-stream" } }).catch(() => null);
          ok = !!res?.ok;
          if (!ok) message = (await res?.json().catch(() => null))?.error || "Network error. Please check your internet connection.";
        }
        if (!ok) throw new Error(message);
        setProgress(Math.round(((i + 1) / total) * 100));
      }
      const fin = await finishCatalogue(id);
      if (fin.error) throw new Error(fin.error);
      formRef.current?.reset();
      setFile(null);
      setProgress(null);
      router.push(`/admin/catalogues?msg=${encodeURIComponent("Catalogue uploaded and published.")}`);
      router.refresh();
    } catch (err) {
      if (id) await cancelCatalogue(id).catch(() => {});
      setProgress(null);
      setError((err as Error).message);
    }
  }

  const busy = progress !== null;

  return (
    <form ref={formRef} onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-bold">
        <FileUp className="h-5 w-5 text-brand-600" /> Upload a new catalogue
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="cat-title">Title *</label>
          <input id="cat-title" name="title" required maxLength={150} className="input" placeholder="e.g. Industrial Air Coolers 2026" />
        </div>
        <div>
          <label className="label" htmlFor="cat-pdf">PDF file * (up to 100 MB)</label>
          <input id="cat-pdf" name="pdf" type="file" accept="application/pdf,.pdf" required className="input py-2" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file && <p className="mt-1 text-xs text-slate-500">{formatBytes(file.size)}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="cat-desc">Short description</label>
          <textarea id="cat-desc" name="description" rows={2} maxLength={600} className="input" placeholder="What is inside this catalogue?" />
        </div>
        <div>
          <label className="label" htmlFor="cat-cover">Cover image (optional, JPG/PNG/WEBP under 4 MB)</label>
          <input id="cat-cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" className="input py-2" />
          <p className="mt-1 text-xs text-slate-500">Tip: use a picture of the catalogue&apos;s front page.</p>
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

      {busy && (
        <div className="mt-4">
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">Uploading… {progress}%. Please keep this page open.</p>
        </div>
      )}

      <button type="submit" disabled={busy} className="btn-primary mt-5 disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />} {busy ? "Uploading…" : "Upload Catalogue"}
      </button>
    </form>
  );
}
