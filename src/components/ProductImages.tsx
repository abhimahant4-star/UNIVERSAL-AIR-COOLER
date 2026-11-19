"use client";

import { useState } from "react";
import { CoolerArt, LogoMark } from "./Icons";

export default function ProductImages({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  if (images.length === 0) return <CoolerArt className="aspect-square w-full rounded-3xl" />;
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[i]} alt={`${name} – image ${i + 1}`} className="aspect-square w-full object-contain" />
        <LogoMark size="lg" />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((src, idx) => (
            <button
              key={src}
              onClick={() => setI(idx)}
              aria-label={`Show image ${idx + 1}`}
              className={`overflow-hidden rounded-xl border-2 ${idx === i ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
