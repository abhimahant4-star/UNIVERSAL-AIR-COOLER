# Universal Air Cooler — Website & Admin Panel

A custom-coded, fully responsive 5-page business website with a dynamic admin panel, built with **Next.js 15 (App Router)**, **Tailwind CSS 4**, **Prisma** and **SQLite**.

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

Requires Node.js 20+.

```bash
npm install
npm run setup     # creates the database and seeds sample data + the admin user
npm run dev       # http://localhost:3000
```

Admin login: the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values in `.env` (used only when the seed first creates the admin). **Change the password from Admin → Website Settings after your first login.**

## Environment variables (`.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Database connection. Default is a local SQLite file. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin account, created by `npm run db:seed` |
| `JWT_SECRET` | Long random string used to sign admin sessions |
| `NEXT_PUBLIC_SITE_URL` | Live domain, e.g. `https://www.universalaircooler.com` (used in sitemap, robots and SEO tags) |

## Production deployment

Deploy to a VPS or Node.js host (for example Hostinger VPS, DigitalOcean or a cPanel host that supports Node.js):

```bash
npm install
npm run setup
npm run build
npm start          # or run with pm2: pm2 start npm --name uac -- start
```

- Uploaded images are stored in the `uploads/` folder, and the database in `prisma/dev.db`. **Back up both.**
- Serverless hosts such as Vercel do not keep files on disk, so this setup needs a host with a persistent disk. To use MySQL or PostgreSQL instead, change `provider` in `prisma/schema.prisma` and `DATABASE_URL`, then run `npm run db:push`.
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
src/app/uploads/            serves uploaded images
src/app/sitemap.ts          sitemap.xml
src/app/robots.ts           robots.txt
src/components/             shared UI
src/lib/                    db, auth, settings, uploads, helpers
src/middleware.ts           protects /admin routes
```
