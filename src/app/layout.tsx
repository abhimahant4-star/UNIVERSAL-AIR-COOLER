import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSettings } from "@/lib/settings";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${s.siteName} | Air Cooler Manufacturer & Supplier`, template: `%s | ${s.siteName}` },
    description: s.aboutShort,
    keywords: ["air cooler", "desert cooler", "personal cooler", "tower cooler", "industrial cooler", "air cooler manufacturer", "air cooler dealer", s.siteName],
    openGraph: { type: "website", siteName: s.siteName, locale: "en_IN" },
    verification: s.googleVerification ? { google: s.googleVerification } : undefined,
  };
}

export const viewport: Viewport = { themeColor: "#2575eb", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
