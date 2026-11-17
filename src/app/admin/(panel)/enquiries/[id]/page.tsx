import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import StatusBadge, { STATUS_LABEL } from "@/components/admin/StatusBadge";
import { ConfirmButton, SubmitButton } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/Icons";
import { prisma } from "@/lib/db";
import { formatDate, telLink, whatsappLink } from "@/lib/utils";
import { deleteEnquiry, updateEnquiry } from "../../../actions";

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const e = Number.isInteger(id) ? await prisma.enquiry.findUnique({ where: { id }, include: { product: true } }) : null;
  if (!e) notFound();

  const rows = [
    ["Name", e.name],
    ["Phone", e.phone],
    ["Email", e.email || "—"],
    ["City", e.city || "—"],
    ["Subject", e.subject || "—"],
    ["Received", formatDate(e.createdAt)],
    ["Last updated", formatDate(e.updatedAt)],
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> All enquiries
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold">Enquiry #{e.id}</h1>
        <StatusBadge status={e.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold">Message</h2>
            {e.product && (
              <p className="mt-2 text-sm">
                Product:{" "}
                <Link href={`/admin/products/${e.product.id}`} className="font-semibold text-brand-700 hover:underline">
                  {e.product.name}
                </Link>
              </p>
            )}
            <p className="mt-3 whitespace-pre-wrap text-slate-700">{e.message}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k} className="border-b border-slate-100 last:border-0">
                    <th className="w-40 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-600">{k}</th>
                    <td className="px-4 py-3 text-slate-800">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-1 font-bold">Contact customer</h2>
            <a href={telLink(e.phone)} className="btn-outline">
              <Phone className="h-4 w-4" /> Call {e.phone}
            </a>
            <a href={whatsappLink(e.phone, `Hello ${e.name}, thank you for your enquiry with Universal Air Cooler.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
            {e.email && (
              <a href={`mailto:${e.email}`} className="btn-outline">
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
          </div>

          <form action={updateEnquiry} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <input type="hidden" name="id" value={e.id} />
            <h2 className="font-bold">Manage status</h2>
            <div>
              <label className="label">Status</label>
              <select name="status" defaultValue={e.status} className="input">
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Internal notes</label>
              <textarea name="notes" rows={4} defaultValue={e.notes} className="input" placeholder="Follow-up details, quoted price…" />
            </div>
            <SubmitButton className="btn-primary w-full">Save</SubmitButton>
          </form>

          <form action={deleteEnquiry} className="text-right">
            <input type="hidden" name="id" value={e.id} />
            <ConfirmButton message="Delete this enquiry permanently?">Delete enquiry</ConfirmButton>
          </form>
        </div>
      </div>
    </div>
  );
}
