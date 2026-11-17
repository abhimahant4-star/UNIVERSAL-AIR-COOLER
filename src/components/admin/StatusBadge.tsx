export const STATUS_LABEL: Record<string, string> = { NEW: "New", IN_PROGRESS: "In Progress", RESOLVED: "Resolved" };

export default function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "NEW" ? "bg-sky-100 text-sky-800" : status === "IN_PROGRESS" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800";
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{STATUS_LABEL[status] ?? status}</span>;
}
