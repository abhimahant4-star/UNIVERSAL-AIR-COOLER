# Universal Air Cooler — Project Summary

_Last updated: 24 Nov 2026 · Latest commit: `ad61cb1` on `main` (all work pushed)_

Business website and admin panel for **Universal Air Cooler / Star Universal Industrial Cooler** (S S Trading Company, Ludhiana).
Repository: https://github.com/abhimahant4-star/UNIVERSAL-AIR-COOLER · Hosting: Vercel (`universal-air-cooler-119a.vercel.app`).

---

## ⚠️ Open item that blocks the live site

The live Vercel site shows an error because **Vercel has no `DATABASE_URL` and no `JWT_SECRET`**.
Fix: Vercel → project → **Settings → Environment Variables** → add both (copy the values from `.env`, *without* the quote marks, tick **Production**) → **Deployments → ⋯ → Redeploy**.
Check afterwards at `https://universal-air-cooler-119a.vercel.app/api/health` — it should say `"ok": true`.

---

## Tech stack

- **Next.js 15** (App Router, server actions), **React 19**, **Tailwind CSS 4**, TypeScript
- **MongoDB Atlas** via **Prisma 6** (database `universal-air-cooler`)
- Images and PDF catalogues are stored **inside MongoDB** (no disk needed, works on Vercel)
- Admin login: bcrypt password + signed JWT cookie (`uac_admin`)

## Website pages

| Page | URL | Notes |
|---|---|---|
| Home | `/` | Catalogue product montage at top (photo first on phones), "Since 1980" on its own smaller line, animated count-up stats, **Our Main Products** (5 cards from the catalogue), intro, categories, featured products, Areas of Application (incl. Forging Units), customer logos, installation photos |
| About Us | `/about` | |
| Our Products | `/products`, `/products/<slug>` | Grouped by category order (Industrial Coolers first); search; spec tables; small logo on every product photo |
| Product Installation | `/product-installation` | (old `/gallery` redirects here) |
| Exhibition Participation | `/exhibitions` | 10 exhibition photos |
| Our Prestigious Customers | `/customers` | 15 logos + HR Forging as a name tile |
| Download Catalogues | `/catalogues`, `/catalogues/<name>.pdf` | View or download PDFs (streamed, any size) |
| Contact Us | `/contact` | Enquiry form, WhatsApp, Google Map of the factory + "Get Directions" |

Floating WhatsApp button everywhere. SEO: sitemap, robots (blocks `/admin`), meta tags, LocalBusiness data with factory coordinates.

## Admin panel (`/admin`)

Dashboard · Products · Categories · **Product Installation** photos · **Exhibition Participation** photos · **Catalogues** (PDF upload up to 100 MB, sent in 3.5 MB pieces) · Enquiries · Website Settings (contact details, customers list, areas of application, texts, social links, map) · change password.

Admin email: `admin@universalaircooler.com` — password is the `ADMIN_PASSWORD` value in `.env` (change it in Admin after first login).

## Content in the database (32 products)

- **Categories (visible):** Industrial Coolers, Evaporative Air Cooling Systems, Commercial Coolers, Exhaust Fans & Ventilation, Industrial Fans, Ducting, Spare Parts & Accessories
- **Recently added:** Commercial Cooler **180L** (same specs as 150L, 180 L tank), Big Air Diffuser (Ø250 mm), Automatic Swing Vent (650 × 450 mm), PP + Fibreglass Fan Blade (680 mm), Manual Drain Valve, Automatic Drain Valve, Double Side Grill (22 × 12 inch)
- **All product photos are on white backgrounds** (150L, 180L, Universal exhaust fans and duct system were cleaned up)
- **Catalogues:** "Industrial, Commercial & Duct Cooling Solutions" and "Commercial Air Coolers"
- **Map:** factory pin 30.953782, 75.889849 (Bajra Road, Ludhiana)

## Branding

- Logo files in `public/`: `logo-light-*.webp` (blue on white, no ISO bar — header, login, placeholders), `logo*.webp` / `logo-hd.png` (blue background — footer, admin sidebar), favicon and share image in `src/app/`
- Customer logos in `public/clients/` (looked up by name in `src/lib/client-logos.ts`)

## Things to confirm with the client

1. **3 products are missing from the database:** "Star Universal Industrial Air Cooler" 18,000 / 30,000 / 40,000 CMH (probably deleted in Admin; still in `prisma/catalog.mjs` and can be restored).
2. **Second phone number:** website shows **+91 98881 44204**, the catalogue shows **98148-29136**.
3. **Baum Forge logo:** the "BAUM Professional Tools" logo (baum.co.in) is used — confirm it is the right company.
4. **HR Forging:** no logo yet (send one to add it).
5. **Customer name spellings:** logos say "Shital Fibers" / "Varindera Tools"; the list says "Sheetal Fibres" / "Varindra Tools" (edit in Website Settings).
6. Drain valve descriptions were written without supplier specs — check wording.
7. The 42 MB "Universal catalogue F.pdf" is not on the Download Catalogues page — upload it in Admin → Catalogues if wanted.
8. Two supplier PDFs (YSFRESH-branded "AIR COOLER.pdf" and the Chinese "Industrial Air Conditioning Fan.pdf") were deliberately **not** published.

**Cancelled:** putting the Universal logo onto every product photo (client changed their mind; nothing was changed).

## Running it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run setup      # only for a fresh database: creates indexes, admin, products, photos, catalogues
```

Test build without disturbing `npm run dev`: `NEXT_DIST_DIR=.next-check npx next build` (then `git checkout -- tsconfig.json`).

## Later clean-up (optional)

- Remove or restrict `/api/health` once the live site works.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel when a custom domain (e.g. universalaircooler.in) is connected.

## Commit history

| Commit | Change |
|---|---|
| `b6d6f23` | Website and admin panel |
| `cd3f339` | MongoDB, images stored in the database |
| `cfae30c` / `22947f4` | Vercel hardening, `/api/health` check |
| `a8acaa7` | HD logo, real product photos |
| `14f3e4c` | Bigger logo, hero changes, animated stats, new menu pages, logo mark on product photos |
| `cd489c9` | Industrial Coolers first on products page |
| `a5e0c95` / `71a1058` | Fixed cropped fan photo, logo mark position |
| `8ef1be0` | Exhibition photos, admin photo sections, downloadable catalogues |
| `1213f55` / `7344cfb` | Customer logos |
| `972a938` / `04b07df` | Grey cooler photo with Universal logo on white |
| `c9bacfe` | Catalogue hero image, 5 main products, factory map, Forging Units |
| `43eadf4` | 180L cooler, 6 accessories, all product photos on white |
| `ad61cb1` | Exhaust Fans photo turned the right way up |
