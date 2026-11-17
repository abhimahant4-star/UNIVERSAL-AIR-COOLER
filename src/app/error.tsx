"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown instead of a blank "Application error" when a page fails (for example if the database is unreachable).
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div className="max-w-md">
        <p className="text-5xl font-extrabold text-brand-600">Oops</p>
        <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-slate-500">
          This page could not be loaded right now. Please try again in a moment, or call us on{" "}
          <a href="tel:+919814829137" className="font-semibold text-brand-700">
            +91 98148 29137
          </a>
          .
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            Try again
          </button>
          <Link href="/" className="btn-outline">
            Go to Home
          </Link>
        </div>
        {error.digest && <p className="mt-6 text-xs text-slate-400">Error reference: {error.digest}</p>}
      </div>
    </main>
  );
}
