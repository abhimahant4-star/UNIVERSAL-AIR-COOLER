"use client";

import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

export function SubmitButton({ children, className = "btn-primary", pendingText = "Saving…" }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

/** A submit button that asks for confirmation first. */
export function ConfirmButton({ children, message, className }: { children: React.ReactNode; message: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className ?? "rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** Shows ?msg= / ?error= flash messages set by server actions, then clears them from the URL. */
export function Flash() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const msg = sp.get("msg");
  const error = sp.get("error");
  const [shown, setShown] = useState<{ msg: string | null; error: string | null }>({ msg, error });

  useEffect(() => {
    if (msg || error) {
      setShown({ msg, error });
      const rest = new URLSearchParams(sp.toString());
      rest.delete("msg");
      rest.delete("error");
      const q = rest.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
      const t = setTimeout(() => setShown({ msg: null, error: null }), 6000);
      return () => clearTimeout(t);
    }
  }, [msg, error, sp, router, pathname]);

  if (!shown.msg && !shown.error) return null;
  return (
    <div
      role="status"
      className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
        shown.error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {shown.error ? <XCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
      {shown.error || shown.msg}
    </div>
  );
}

// The hosting platform (Vercel) rejects requests over 4.5 MB, so one save must stay under that in total.
const MAX_FILE_MB = 4;
const MAX_TOTAL_MB = 4.3;

/** File input with live thumbnails of the chosen images. Rejects selections that are too large to upload. */
export function ImagePicker({ name, multiple = true }: { name: string; multiple?: boolean }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState("");
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p)), [previews]);
  return (
    <div>
      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple={multiple}
        className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          const mb = (n: number) => n / 1024 / 1024;
          const big = files.find((f) => mb(f.size) > MAX_FILE_MB);
          const total = mb(files.reduce((s, f) => s + f.size, 0));
          const problem = big
            ? `"${big.name}" is ${mb(big.size).toFixed(1)} MB. Each image must be under ${MAX_FILE_MB} MB; please resize it.`
            : total > MAX_TOTAL_MB
              ? `These images total ${total.toFixed(1)} MB. Upload under ${MAX_TOTAL_MB} MB at a time (choose fewer images and save in batches).`
              : "";
          setError(problem);
          if (problem) {
            e.target.value = "";
            setPreviews([]);
            return;
          }
          setPreviews(files.map((f) => URL.createObjectURL(f)));
        }}
      />
      <p className="mt-1 text-xs text-slate-500">
        JPG, PNG, WEBP, GIF or AVIF. Under {MAX_FILE_MB} MB each, and under {MAX_TOTAL_MB} MB in total per save.
      </p>
      {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}
      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {previews.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p} src={p} alt="" className="h-20 w-20 rounded-lg object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
