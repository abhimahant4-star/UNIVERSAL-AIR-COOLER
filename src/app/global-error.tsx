"use client";

// Last-resort error page, used when the root layout itself fails. It cannot rely on the site's CSS.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, background: "#f8fafc", color: "#0f172a", textAlign: "center", padding: 16 }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 24 }}>Universal Air Cooler</h1>
          <p style={{ color: "#64748b" }}>
            The website is temporarily unavailable. Please try again in a moment, or call{" "}
            <a href="tel:+919814829137" style={{ color: "#1d5fd8", fontWeight: 600 }}>
              +91 98148 29137
            </a>
            .
          </p>
          <button onClick={reset} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 999, border: 0, background: "#2575eb", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Try again
          </button>
          {error.digest && <p style={{ marginTop: 20, fontSize: 12, color: "#94a3b8" }}>Error reference: {error.digest}</p>}
        </div>
      </body>
    </html>
  );
}
