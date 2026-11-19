import { clientLogo } from "@/lib/client-logos";
import { lines } from "@/lib/utils";

/** "Our prestigious customers": names come from Admin → Website Settings (one per line); logos from src/lib/client-logos.ts. */
export default function Clients({ list, className = "" }: { list: string; className?: string }) {
  const names = lines(list);
  if (names.length === 0) return null;
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Trusted By</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Our Prestigious Customers</h2>
          <p className="mt-3 text-slate-600">Leading industries, manufacturers and hospitality brands rely on our cooling and ventilation systems.</p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {names.map((n) => {
            const logo = clientLogo(n);
            return (
              <li
                key={n}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
              >
                <div className={`flex h-24 items-center justify-center px-4 sm:h-28 sm:px-6 ${logo?.dark ? "bg-brand-950" : "bg-white"}`}>
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo.src} alt={`${n} logo`} loading="lazy" className="max-h-16 w-auto max-w-full object-contain transition duration-300 group-hover:scale-105 sm:max-h-20" />
                  ) : (
                    <span className="text-center text-lg leading-tight font-extrabold tracking-tight text-brand-800 uppercase sm:text-xl">{n}</span>
                  )}
                </div>
                <p className="border-t border-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-600 sm:text-sm">{n}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
