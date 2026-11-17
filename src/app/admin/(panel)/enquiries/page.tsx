import Link from "next/link";
import StatusBadge, { STATUS_LABEL } from "@/components/admin/StatusBadge";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminEnquiries({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status = "", q = "" } = await searchParams;
  const where = {
    ...(status in STATUS_LABEL ? { status } : {}),
    ...(q ? { OR: (["name", "phone", "email", "message"] as const).map((f) => ({ [f]: { contains: q, mode: "insensitive" as const } })) } : {}),
  };
  const [enquiries, counts] = await Promise.all([
    prisma.enquiry.findMany({ where, orderBy: { createdAt: "desc" }, include: { product: { select: { name: true } } }, take: 300 }),
    prisma.enquiry.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const total = counts.reduce((a, c) => a + c._count, 0);
  const tabs = [{ key: "", label: "All", n: total }, ...Object.entries(STATUS_LABEL).map(([key, label]) => ({ key, label, n: count(key) }))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Customer Enquiries</h1>
        <p className="text-sm text-slate-500">Enquiries submitted from the website contact and product forms.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.key ? `/admin/enquiries?status=${t.key}` : "/admin/enquiries"}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${status === t.key ? "bg-brand-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`}
            >
              {t.label} <span className="opacity-70">({t.n})</span>
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, phone, message…" className="input w-64" />
          <button className="btn-outline">Search</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Enquiry</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No enquiries found.
                </td>
              </tr>
            )}
            {enquiries.map((e) => (
              <tr key={e.id} className={`hover:bg-slate-50 ${e.status === "NEW" ? "font-semibold" : ""}`}>
                <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDate(e.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/enquiries/${e.id}`} className="text-slate-900 hover:text-brand-700">
                    {e.name}
                  </Link>
                  {e.city && <p className="text-xs font-normal text-slate-400">{e.city}</p>}
                </td>
                <td className="px-4 py-3 font-normal text-slate-600">
                  <p>{e.phone}</p>
                  {e.email && <p className="text-xs text-slate-400">{e.email}</p>}
                </td>
                <td className="max-w-sm px-4 py-3 font-normal">
                  <Link href={`/admin/enquiries/${e.id}`} className="block hover:text-brand-700">
                    {e.product && <span className="mr-1 rounded bg-brand-50 px-1.5 py-0.5 text-xs text-brand-700">{e.product.name}</span>}
                    <span className="line-clamp-2 text-slate-600">{e.subject ? `${e.subject} — ` : ""}{e.message}</span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={e.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
