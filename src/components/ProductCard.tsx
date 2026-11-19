import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoolerArt, LogoMark } from "./Icons";
import { formatPrice, parseImages } from "@/lib/utils";

type P = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number | null;
  showPrice: boolean;
  images: string;
  category: { name: string } | null;
};

const TONES = ["sky", "teal", "orange", "slate"] as const;

export default function ProductCard({ p }: { p: P }) {
  const img = parseImages(p.images)[0];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200">
      <Link href={`/products/${p.slug}`} className={`relative block aspect-[4/3] overflow-hidden ${img ? "bg-white" : "bg-slate-100"}`}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={p.name} loading="lazy" className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" />
        ) : (
          <CoolerArt tone={TONES[parseInt(p.id.slice(-2), 16) % TONES.length || 0]} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        )}
        {p.category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">{p.category.name}</span>
        )}
        {img && <LogoMark />}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">
          <Link href={`/products/${p.slug}`} className="hover:text-brand-700">
            {p.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="text-base font-bold text-brand-700">{p.showPrice && p.price != null ? formatPrice(p.price) : "Price on request"}</span>
          <Link href={`/products/${p.slug}`} className="flex items-center gap-1 text-sm font-semibold text-slate-800 hover:text-brand-700" aria-label={`View details of ${p.name}`}>
            Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
