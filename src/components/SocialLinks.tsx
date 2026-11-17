import type { SiteSettings } from "@/lib/settings";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "./Icons";

export function socialList(s: SiteSettings) {
  return [
    { href: s.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: s.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.youtube, label: "YouTube", Icon: YouTubeIcon },
  ].filter((x) => x.href);
}

export default function SocialLinks({ s, className = "" }: { s: SiteSettings; className?: string }) {
  const list = socialList(s);
  if (list.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {list.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.siteName} on ${label}`}
          title={label}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-current transition hover:bg-brand-600 hover:text-white"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
