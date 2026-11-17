# Universal Air Cooler — Website & Admin Panel

A custom-coded, fully responsive 5-page business website with a dynamic admin panel, built with **Next.js 15 (App Router)**, **Tailwind CSS 4**, **Prisma** and **MongoDB**. Uploaded images are stored in MongoDB too, so the site runs on Vercel or any Node.js host without disk storage.

## Features

**Public website**
- **Home** (`/`): hero, company intro, stats, product categories, featured products, business highlights, gallery preview, call/enquiry/WhatsApp buttons
- **About Us** (`/about`): company introduction, business profile, mission and vision
- **Our Products** (`/products`): dynamic listing with category filter and search; product detail pages (`/products/[slug]`) with image gallery, features, specs table, enquiry form and WhatsApp button
- **Gallery** (`/gallery`): dynamic image gallery with category filter and lightbox
- **Contact Us** (`/contact`): contact info, enquiry form, WhatsApp button, Google Maps embed
- Floating WhatsApp button on every page

**Admin panel** (`/admin`)
- Secure login (bcrypt-hashed password, signed httpOnly JWT cookie, login rate limiting)
- Dashboard with counts and recent enquiries
- Products: add, edit, delete, upload multiple images, choose a cover image, set prices and show or hide them, mark as featured, hide or show, per-product SEO title and description
- Categories: add, edit, reorder, delete
- Gallery: upload multiple images, edit title, category and order, delete
- Enquiries: list, filter by status, search, view details, set status (New / In Progress / Resolved), internal notes, call/WhatsApp/email the customer, delete
- Website settings: business details, WhatsApp number, Google Maps embed, home and about page text, stats, social links, Google Search Console verification code
- Change admin password

**SEO**
- Clean URLs (`/products/universal-desert-king-90l`)
- Per-page meta titles and descriptions, canonical URLs, Open Graph tags
- Proper H1/H2/H3 structure and image ALT text
- `sitemap.xml` (generated automatically, includes all products) and `robots.txt` (blocks `/admin`)
- LocalBusiness and Product structured data (JSON-LD)
- Google Search Console verification through the admin settings

## Getting started

Requires Node.js 20+ and a MongoDB database (for example a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster). Copy `.env.example` to `.env` and put the connection string in `DATABASE_URL`, including the database name.

```bash
npm install
npm run setup     # creates the indexes and loads the products, gallery and admin user
npm run dev       # http://localhost:3000
```

Admin login: the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values in `.env`. They are only used by `npm run setup` to create the first admin account (there is no default password). After that, change the password from **Admin → Website Settings**; changing `.env` later does not change it.

## Environment variables

| Variable | Needed by | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Website + setup | MongoDB connection string with the database name, e.g. `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/universal-air-cooler` |
| `JWT_SECRET` | Website | Long random string used to sign admin logins. Keep it secret. Changing it logs everyone out. |
| `NEXT_PUBLIC_SITE_URL` | Website (optional) | Live address, e.g. `https://www.universalaircooler.in`, used in the sitemap, robots.txt and SEO tags. On Vercel it defaults to the project's production domain. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Setup only | First admin account, created by `npm run setup`. Not needed on Vercel. |

## Production deployment

### Vercel

1. **MongoDB Atlas:** create a free cluster and a database user. Under *Network Access* allow `0.0.0.0/0`, because Vercel has no fixed IP address. Copy the connection string and add the database name before the `?`.
2. **Load the data once** from your computer: put that string in `.env` as `DATABASE_URL` and run `npm run setup`.
3. **Vercel:** import the GitHub repository. Before (or after) the first deploy, open *Settings → Environment Variables* and add `DATABASE_URL` and `JWT_SECRET` (copy both from `.env`, without the quote marks), plus `NEXT_PUBLIC_SITE_URL` once you have a custom domain. Then *Deployments → ⋯ → Redeploy*, because variables only take effect on a new deployment.

Every `git push` to `main` then redeploys the site. Images uploaded through the admin panel must be under 4 MB each (and under about 4.3 MB per save), because Vercel limits request size.

### VPS or other Node.js host

```bash
npm install
npm run setup
npm run build
npm start          # or run with pm2: pm2 start npm --name uac -- start
```

- All content, enquiries and uploaded images live in MongoDB. Atlas backs it up for you; on your own MongoDB server, back it up regularly.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain and serve the site over HTTPS. The admin cookie is marked secure when that URL starts with `https`.

## Google Search Console

1. Add the property in Search Console and choose the **HTML tag** method.
2. Copy only the `content="…"` value and paste it in **Admin → Website Settings → Google Search Console verification code**, then save.
3. Click Verify, then submit `https://your-domain/sitemap.xml` under **Sitemaps**.

## Project structure

```
prisma/schema.prisma        database models
prisma/seed.mjs             first admin user + initial catalogue
prisma/catalog.mjs          initial categories, products (with specs) and gallery, from the brochures
prisma/seed-images/         product and gallery photos cropped from the brochures
src/app/(site)/             public pages (home, about, products, gallery, contact)
src/app/admin/              admin login + panel pages, server actions
src/app/uploads/            serves uploaded images (stored in MongoDB)
src/app/sitemap.ts          sitemap.xml
src/app/robots.ts           robots.txt
src/components/             shared UI
src/lib/                    db, auth, settings, uploads, helpers
src/middleware.ts           protects /admin routes
```
