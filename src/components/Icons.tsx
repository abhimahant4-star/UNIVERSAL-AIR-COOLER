export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.45-5.02c0-5.2 4.24-9.44 9.46-9.44a9.4 9.4 0 0 1 6.68 2.77 9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.43-9.45 9.43zm8.04-17.47A11.3 11.3 0 0 0 12.04.7C5.77.7.67 5.8.67 12.07c0 2 .52 3.96 1.52 5.68L.57 23.7l6.08-1.6a11.33 11.33 0 0 0 5.39 1.37h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.9-3.34-8.05z" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.23 2.68.23v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function YouTubeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.38.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3 3 0 0 0 2.12-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.57V8.43L15.84 12 9.6 15.57z" />
    </svg>
  );
}

/** Illustration used when a product has no uploaded photo yet. */
export function CoolerArt({ className = "", tone = "sky" }: { className?: string; tone?: "sky" | "teal" | "slate" | "orange" }) {
  const colors = {
    sky: ["#e0f2fe", "#38bdf8", "#0369a1"],
    teal: ["#ccfbf1", "#2dd4bf", "#0f766e"],
    slate: ["#e2e8f0", "#94a3b8", "#334155"],
    orange: ["#ffedd5", "#fb923c", "#c2410c"],
  }[tone];
  return (
    <svg viewBox="0 0 300 300" className={className} role="img" aria-label="Air cooler illustration">
      <rect width="300" height="300" fill={colors[0]} />
      <circle cx="240" cy="60" r="70" fill="#fff" opacity="0.5" />
      <g transform="translate(80 30)">
        <rect width="140" height="220" rx="18" fill={colors[1]} />
        <rect width="140" height="44" rx="18" fill="#fff" opacity="0.35" />
        <circle cx="26" cy="22" r="6" fill="#fff" />
        <circle cx="46" cy="22" r="6" fill="#fff" opacity="0.7" />
        <rect x="84" y="15" width="38" height="13" rx="6" fill="#fff" opacity="0.85" />
        <rect x="16" y="58" width="108" height="110" rx="10" fill={colors[2]} opacity="0.4" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x="24" y={68 + i * 16} width="92" height="6" rx="3" fill="#fff" opacity="0.9" />
        ))}
        <rect x="16" y="180" width="108" height="24" rx="8" fill="#fff" opacity="0.3" />
        <circle cx="24" cy="228" r="9" fill="#1e293b" />
        <circle cx="116" cy="228" r="9" fill="#1e293b" />
      </g>
    </svg>
  );
}
