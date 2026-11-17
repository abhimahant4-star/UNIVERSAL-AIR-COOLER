import { lines } from "@/lib/utils";

/** "Our prestigious customers" — names come from the admin Website Settings (one per line). */
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
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {names.map((n) => (
            <li key={n} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-sm font-extrabold text-brand-700">{n.slice(0, 1).toUpperCase()}</span>
              <span className="text-sm font-semibold text-slate-800">{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
