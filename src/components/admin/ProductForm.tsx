import Link from "next/link";
import type { Category, Product } from "@prisma/client";
import { ImagePicker, SubmitButton } from "./ui";
import { parseImages } from "@/lib/utils";

type Props = { product?: Product | null; categories: Category[]; action: (fd: FormData) => Promise<void> };

function Section({ title, children, desc }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="font-bold">{title}</h2>
      {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function ProductForm({ product, categories, action }: Props) {
  const images = product ? parseImages(product.images) : [];
  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <Section title="Basic Details">
          <div>
            <label className="label" htmlFor="name">
              Product name *
            </label>
            <input id="name" name="name" required defaultValue={product?.name} className="input" placeholder="e.g. Universal Desert King 90L" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="categoryId">
                Category
              </label>
              <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? ""} className="input">
                <option value="">— No category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="slug">
                URL slug
              </label>
              <input id="slug" name="slug" defaultValue={product?.slug} className="input" placeholder="auto-generated from name" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="shortDescription">
              Short description
            </label>
            <input id="shortDescription" name="shortDescription" defaultValue={product?.shortDescription} maxLength={300} className="input" placeholder="One line shown on product cards" />
          </div>
          <div>
            <label className="label" htmlFor="description">
              Full description
            </label>
            <textarea id="description" name="description" rows={6} defaultValue={product?.description} className="input" placeholder="Leave a blank line between paragraphs" />
          </div>
        </Section>

        <Section title="Features & Specifications">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="features">
                Key features <span className="font-normal text-slate-400">(one per line)</span>
              </label>
              <textarea id="features" name="features" rows={7} defaultValue={product?.features} className="input" placeholder={"Honeycomb cooling pads\n60 ft air throw"} />
            </div>
            <div>
              <label className="label" htmlFor="specs">
                Specifications <span className="font-normal text-slate-400">(Label: Value per line)</span>
              </label>
              <textarea id="specs" name="specs" rows={7} defaultValue={product?.specs} className="input font-mono text-xs" placeholder={"Tank Capacity: 90 Litres\nPower: 210 W"} />
              <p className="mt-1 text-xs text-slate-500">
                For a table of models, start lines with <code>|</code> — the first is the header, e.g. <code>|Model|Power|Air Flow</code> then <code>|850|370 W|13000</code>.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Product Images" desc="The first image is used as the cover image on product cards.">
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((src, i) => (
                <div key={src} className="rounded-xl border border-slate-200 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                  <label className="mt-2 flex items-center gap-2 text-xs">
                    <input type="radio" name="coverImage" value={src} defaultChecked={i === 0} /> Cover
                  </label>
                  <label className="mt-1 flex items-center gap-2 text-xs text-red-600">
                    <input type="checkbox" name="removeImage" value={src} /> Remove
                  </label>
                </div>
              ))}
            </div>
          )}
          <ImagePicker name="images" />
        </Section>

        <Section title="SEO" desc="Optional. Leave empty to use the product name and short description.">
          <div>
            <label className="label" htmlFor="metaTitle">
              Meta title
            </label>
            <input id="metaTitle" name="metaTitle" maxLength={120} defaultValue={product?.metaTitle} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="metaDescription">
              Meta description
            </label>
            <textarea id="metaDescription" name="metaDescription" rows={2} maxLength={300} defaultValue={product?.metaDescription} className="input" />
          </div>
        </Section>
      </div>

      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <Section title="Price">
          <div>
            <label className="label" htmlFor="price">
              Price (₹)
            </label>
            <input id="price" name="price" inputMode="decimal" defaultValue={product?.price ?? ""} className="input" placeholder="Leave empty for “Price on request”" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showPrice" defaultChecked={product?.showPrice ?? false} className="h-4 w-4" /> Show price on website
          </label>
        </Section>
        <Section title="Visibility">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4" /> Visible on website
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4" /> Featured on home page
          </label>
        </Section>
        <div className="flex gap-3">
          <SubmitButton className="btn-primary flex-1 py-3">{product ? "Save Changes" : "Create Product"}</SubmitButton>
          <Link href="/admin/products" className="btn-outline py-3">
            Cancel
          </Link>
        </div>
        {product && (
          <a href={`/products/${product.slug}`} target="_blank" className="block text-center text-sm font-semibold text-brand-700 hover:underline">
            View on website ↗
          </a>
        )}
      </div>
    </form>
  );
}
