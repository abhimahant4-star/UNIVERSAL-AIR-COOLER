"use client";

import { useActionState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions";

type Props = { productId?: number; productName?: string; compact?: boolean };

export default function EnquiryForm({ productId, productName, compact }: Props) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { ok: false, message: "" });

  if (state.ok) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center" role="status">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <p className="mt-3 text-lg font-bold text-emerald-900">Enquiry sent</p>
        <p className="mt-1 text-sm text-emerald-800">{state.message}</p>
      </div>
    );
  }

  const err = (k: string) => state.errors?.[k];
  const field = (k: string) => `input ${err(k) ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}`;

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {productId && <input type="hidden" name="productId" value={productId} />}

      <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div>
          <label htmlFor="name" className="label">
            Full name *
          </label>
          <input id="name" name="name" required className={field("name")} placeholder="Your name" autoComplete="name" />
          {err("name") && <p className="mt-1 text-xs text-red-600">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone / WhatsApp *
          </label>
          <input id="phone" name="phone" type="tel" required className={field("phone")} placeholder="+91 98765 43210" autoComplete="tel" />
          {err("phone") && <p className="mt-1 text-xs text-red-600">{err("phone")}</p>}
        </div>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" name="email" type="email" className={field("email")} placeholder="you@example.com" autoComplete="email" />
          {err("email") && <p className="mt-1 text-xs text-red-600">{err("email")}</p>}
        </div>
        <div>
          <label htmlFor="city" className="label">
            City
          </label>
          <input id="city" name="city" className="input" placeholder="Your city" autoComplete="address-level2" />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="label">
          Subject
        </label>
        <input id="subject" name="subject" className="input" defaultValue={productName ? `Enquiry about ${productName}` : ""} placeholder="Product enquiry, dealership, service…" />
      </div>
      <div>
        <label htmlFor="message" className="label">
          Message *
        </label>
        <textarea id="message" name="message" rows={compact ? 4 : 5} required className={field("message")} placeholder="Tell us your requirement — room size, quantity, model…" />
        {err("message") && <p className="mt-1 text-xs text-red-600">{err("message")}</p>}
      </div>
      {state.message && !state.ok && <p className="text-sm font-medium text-red-600">{state.message}</p>}
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        <Send className="h-4 w-4" /> {pending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
