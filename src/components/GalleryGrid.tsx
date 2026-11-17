"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Img = { id: number; url: string; title: string; category: string };

export default function GalleryGrid({ images }: { images: Img[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(images.map((i) => i.category)))], [images]);
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = cat === "All" ? images : images.filter((i) => i.category === cat);

  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + shown.length) % shown.length)), [shown.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  if (images.length === 0) {
    return <p className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">New photos are coming soon.</p>;
  }

  const current = open !== null ? shown[open] : null;

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Gallery categories">
        {cats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${cat === c ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {shown.map((img, i) => (
          <button key={img.id} onClick={() => setOpen(i)} className="group relative mb-4 block w-full overflow-hidden rounded-2xl bg-slate-100 break-inside-avoid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.title || `${img.category} photo`} loading="lazy" className="w-full transition duration-500 group-hover:scale-105" />
            {img.title && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                {img.title}
              </span>
            )}
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={current.title || "Image"} onClick={() => setOpen(null)}>
          <button className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close" onClick={() => setOpen(null)}>
            <X className="h-6 w-6" />
          </button>
          {shown.length > 1 && (
            <>
              <button className="absolute left-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6" aria-label="Previous" onClick={(e) => (e.stopPropagation(), step(-1))}>
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button className="absolute right-2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6" aria-label="Next" onClick={(e) => (e.stopPropagation(), step(1))}>
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.title || "Gallery image"} className="max-h-[80vh] rounded-lg object-contain" />
            {current.title && <figcaption className="mt-3 text-center text-sm text-white/80">{current.title}</figcaption>}
          </figure>
        </div>
      )}
    </>
  );
}
