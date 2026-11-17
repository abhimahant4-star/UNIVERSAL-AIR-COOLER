import { SubmitButton } from "@/components/admin/ui";
import { getSettings, type SettingKey } from "@/lib/settings";
import { changePassword, saveSettings } from "../../actions";

type Field = { key: SettingKey; label: string; rows?: number; hint?: string };

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Business Information",
    fields: [
      { key: "siteName", label: "Business name" },
      { key: "tagline", label: "Tagline" },
      { key: "phone", label: "Phone number (primary)" },
      { key: "phone2", label: "Phone number (second)", hint: "Leave empty to show only one number." },
      { key: "whatsapp", label: "WhatsApp number", hint: "With country code, digits only — e.g. 919876543210" },
      { key: "email", label: "Email" },
      { key: "businessHours", label: "Business hours" },
      { key: "address", label: "Address", rows: 2 },
      { key: "mapEmbedUrl", label: "Google Maps embed", rows: 3, hint: "Google Maps → Share → Embed a map → copy HTML, and paste it here (or just the src URL)." },
    ],
  },
  {
    title: "Home Page",
    fields: [
      { key: "heroTitle", label: "Hero heading" },
      { key: "heroSubtitle", label: "Hero sub-heading", rows: 3 },
      { key: "yearsExperience", label: "Years of experience" },
      { key: "happyCustomers", label: "Happy customers" },
      { key: "productsCount", label: "Number of models" },
      { key: "dealers", label: "Dealers & partners" },
    ],
  },
  {
    title: "About Us Page",
    fields: [
      { key: "aboutShort", label: "Short introduction", rows: 3, hint: "Also used in the footer and as the default meta description." },
      { key: "aboutText", label: "Company introduction", rows: 8, hint: "Leave a blank line between paragraphs." },
      { key: "mission", label: "Mission", rows: 3 },
      { key: "vision", label: "Vision", rows: 3 },
      { key: "productRange", label: "Product range", rows: 8, hint: "One item per line." },
      { key: "industries", label: "Industries / areas served", rows: 6, hint: "One item per line." },
      { key: "clients", label: "Prestigious customers", rows: 8, hint: "One name per line. Shown on the Home and About pages." },
    ],
  },
  {
    title: "Social & SEO",
    fields: [
      { key: "facebook", label: "Facebook URL" },
      { key: "instagram", label: "Instagram URL" },
      { key: "youtube", label: "YouTube URL" },
      { key: "googleVerification", label: "Google Search Console verification code", hint: "Only the content value of the HTML-tag verification method." },
    ],
  },
];

export default async function AdminSettings() {
  const s = await getSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Website Settings</h1>
        <p className="text-sm text-slate-500">Update contact details and the text shown across your website.</p>
      </div>

      <form action={saveSettings} className="space-y-6">
        {GROUPS.map((g) => (
          <section key={g.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-bold">{g.title}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {g.fields.map((f) => (
                <div key={f.key} className={f.rows ? "md:col-span-2" : ""}>
                  <label htmlFor={f.key} className="label">
                    {f.label}
                  </label>
                  {f.rows ? (
                    <textarea id={f.key} name={f.key} rows={f.rows} defaultValue={s[f.key]} className="input" />
                  ) : (
                    <input id={f.key} name={f.key} defaultValue={s[f.key]} className="input" />
                  )}
                  {f.hint && <p className="mt-1 text-xs text-slate-500">{f.hint}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton className="btn-primary px-8 py-3 shadow-xl">Save Settings</SubmitButton>
        </div>
      </form>

      <form action={changePassword} className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="font-bold">Change Admin Password</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="label">Current password</label>
            <input name="current" type="password" required autoComplete="current-password" className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">New password</label>
              <input name="next" type="password" required minLength={8} autoComplete="new-password" className="input" />
            </div>
            <div>
              <label className="label">Confirm new password</label>
              <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className="input" />
            </div>
          </div>
          <SubmitButton className="btn-outline">Update Password</SubmitButton>
        </div>
      </form>
    </div>
  );
}
