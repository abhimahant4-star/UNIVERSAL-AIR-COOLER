import { cache } from "react";
import { prisma } from "./db";

/** Factory location on Google Maps (Bajra Road, Ludhiana), used for directions and search engines. */
export const FACTORY_LOCATION = { lat: 30.953782, lng: 75.889849 };

export const DEFAULT_SETTINGS = {
  siteName: "Universal Air Cooler",
  tagline: "The Leaders in Evaporative Air Cooling Since 1980",
  phone: "+91 98148 29137",
  phone2: "+91 98881 44204",
  whatsapp: "919814829137",
  email: "sstradingcom@yahoo.com",
  address:
    "Regd. Office: Opp. Bank of Baroda, Shingar Cinema Road, Ludhiana-141008 (Punjab)\nFactory: Bajra Road, Rahon Road, Bajra, Ludhiana-141007 (Punjab)",
  businessHours: "Mon - Sat: 9:30 AM - 8:00 PM",
  // Factory, Bajra Road, Ludhiana: 30°57'13.6"N 75°53'23.5"E
  mapEmbedUrl: "https://www.google.com/maps?q=30.953782,75.889849&z=17&output=embed",
  heroTitle: "Complete Evaporative Cooling Solutions Since 1980",
  heroSubtitle:
    "Manufacturer of evaporative air cooling systems, desert and industrial coolers, air washers, honeycomb pads, ducting, ventilation systems and more, for industries, institutions and homes.",
  aboutShort:
    "An eminent manufacturer with decades of experience in evaporative cooling technology, designing and developing a wide range of cooling and ventilation systems since 1980.",
  aboutText:
    "An eminent manufacturer, with decades of experience in Evaporative Cooling Technology, providing complete cooling solutions. We have been engaged in designing and developing a wide range of cooling systems since 1980, and are the leaders in evaporative air cooling.\n\nOur cooling systems provide high saturation efficiency. They are technically advanced, precision engineered and manufactured from premium grade raw material. As a result, they deliver trouble-free performance, durability, efficient cooling and low energy consumption.\n\nOur products are highly preferred by customers for their elegant looks, sturdy construction and cost effectiveness. They are used in industries, hosiery units, textile mills, garment factories, hospitals, schools, canteens, hotels, restaurants, agriculture and homes: wherever air cooling and ventilation is required.",
  productRange:
    "Axial Fan Series Evaporative Air Cooling Systems\nDesert Coolers\nPortable Coolers\nDesigner Coolers\nGalvanized Steel Coolers\nPlastic Coolers\nIndustrial Coolers\nAir Washer Systems with Cellulose (Honeycomb) Pads\nBlower Units\nCellulose (Honeycomb) Pads\nAll Types of Ducting\nExhaust Fans & Ventilation Systems\nWater Coolers & Industrial Chillers\nPedestal Fans",
  industries:
    "Industries\nForging Units\nHosiery Units\nTextile Mills\nGarment Factories\nHospitals\nSchools\nCanteens\nHotels\nRestaurants\nAgriculture\nHomes",
  clients:
    "Livguard\nSportking\nMonte Carlo\nHaveli Restaurant\nSML Isuzu\nHero Motors\nBonn\nAarti Steel\nMetro Tyres\nJujhar Group\nBaum Forge\nHR Forging\nDainik Savera\nSheetal Fibres\nJuneja Forging\nVarindra Tools",
  mission:
    "To deliver reliable, energy-efficient and affordable cooling products backed by honest advice and dependable after-sales service.",
  vision:
    "To become the most trusted air cooler brand in the region, known for quality, value and customer satisfaction.",
  yearsExperience: "45+",
  happyCustomers: "25,000+",
  productsCount: "50+",
  dealers: "200+",
  facebook: "https://www.facebook.com/share/1BxFW55hEV/",
  instagram: "https://www.instagram.com/universal_cooler",
  youtube: "https://www.youtube.com/@universal_cooler",
  googleVerification: "",
};

export type SiteSettings = typeof DEFAULT_SETTINGS;
export type SettingKey = keyof SiteSettings;

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const merged: SiteSettings = { ...DEFAULT_SETTINGS };
  let rows: { key: string; value: string }[] = [];
  try {
    rows = await prisma.setting.findMany();
  } catch (e) {
    // Fall back to defaults (e.g. during a build without database access) instead of failing the page.
    console.error("Could not load site settings:", (e as Error).message);
  }
  for (const r of rows) {
    if (r.key in merged) (merged as Record<string, string>)[r.key] = r.value;
  }
  return merged;
});
