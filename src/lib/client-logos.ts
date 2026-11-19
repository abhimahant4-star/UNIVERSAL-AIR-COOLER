import { slugify } from "./utils";

/**
 * Logos for "Our Prestigious Customers", taken from each company's own website (files in public/clients).
 * Looked up by the customer's name as typed in Admin → Website Settings, so spelling variants still match.
 * `dark: true` = the logo has white lettering, so it is shown on a dark tile.
 */
const LOGOS: Record<string, { src: string; dark?: boolean }> = {
  livguard: { src: "/clients/livguard.webp" },
  sportking: { src: "/clients/sportking.webp", dark: true },
  "monte-carlo": { src: "/clients/monte-carlo.webp", dark: true },
  haveli: { src: "/clients/haveli-restaurant.webp" },
  "sml-isuzu": { src: "/clients/sml-isuzu.webp" },
  "sml-mahindra": { src: "/clients/sml-isuzu.webp" },
  "hero-motors": { src: "/clients/hero-motors.webp" },
  bonn: { src: "/clients/bonn.webp" },
  "aarti-steel": { src: "/clients/aarti-steel.webp" },
  "metro-tyres": { src: "/clients/metro-tyres.webp", dark: true },
  "dainik-savera": { src: "/clients/dainik-savera.webp" },
  baum: { src: "/clients/baum-forge.webp" },
};

/** Words ignored when matching, so "Haveli Restaurant", "Aarti Steels" or "Bonn Group" still find their logo. */
const EXTRA = /-(restaurant|restaurants|group|groups|ltd|limited|pvt|private|india|industries|times|forge|forging|forgings)$/;

export function clientLogo(name: string) {
  let key = slugify(name);
  for (let i = 0; i < 4 && key; i++) {
    const hit = LOGOS[key] ?? LOGOS[key.replace(/s$/, "")];
    if (hit) return hit;
    const shorter = key.replace(EXTRA, "");
    if (shorter === key) break;
    key = shorter;
  }
  return null;
}
