// Seeds the first admin user, categories, products, gallery images and PDF catalogues (data in ./catalog.mjs).
// Safe to re-run: products, gallery and catalogues are only created when those tables are empty.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "fs/promises";
import path from "path";
import { catalogues, categories, gallery, products } from "./catalog.mjs";

const prisma = new PrismaClient();
const SEED_IMAGES = path.join(process.cwd(), "prisma", "seed-images");
const SEED_CATALOGUES = path.join(process.cwd(), "prisma", "seed-catalogues");
const CHUNK_SIZE = 3.5 * 1024 * 1024; // same as src/lib/catalogue.ts

/** Stores a seed image in the Upload collection and returns its public URL (/uploads/<folder>/<file>). */
async function publish(folder, file) {
  const key = `${folder}/${file}`;
  const data = await readFile(path.join(SEED_IMAGES, folder, file));
  const contentType = file.endsWith(".png") ? "image/png" : "image/jpeg";
  await prisma.upload.upsert({
    where: { path: key },
    update: { data, size: data.length, contentType },
    create: { path: key, data, size: data.length, contentType },
  });
  return `/uploads/${key}`;
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

async function main() {
  // The first admin comes from ADMIN_EMAIL / ADMIN_PASSWORD in .env. There is deliberately no default password.
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  if (!email || password.length < 8) {
    console.warn("Skipping admin user: set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 8 characters in .env.");
  } else if (!(await prisma.admin.findUnique({ where: { email } }))) {
    await prisma.admin.create({ data: { email, name: "Administrator", passwordHash: await bcrypt.hash(password, 10) } });
    console.log(`Created admin user ${email}`);
  }

  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  if ((await prisma.product.count()) === 0) {
    for (const p of products) {
      const cat = await prisma.category.findUnique({ where: { slug: p.category } });
      const images = [];
      for (const f of p.images ?? []) images.push(await publish("products", f));
      await prisma.product.create({
        data: {
          name: p.name,
          slug: slugify(p.name),
          categoryId: cat?.id,
          shortDescription: p.shortDescription,
          description: p.description,
          features: p.features ?? "",
          specs: p.specs ?? "",
          featured: !!p.featured,
          images: JSON.stringify(images),
        },
      });
    }
    console.log(`Created ${products.length} products`);
  }

  if ((await prisma.galleryImage.count()) === 0) {
    let i = 0;
    for (const g of gallery) {
      const url = await publish("gallery", g.file);
      await prisma.galleryImage.create({ data: { url, title: g.title, category: g.category, sortOrder: i++ } });
    }
    console.log(`Created ${gallery.length} gallery images`);
  }

  if ((await prisma.catalogue.count()) === 0) {
    let order = 1;
    for (const c of catalogues) {
      const pdf = await readFile(path.join(SEED_CATALOGUES, `${c.slug}.pdf`));
      const cover = await readFile(path.join(SEED_CATALOGUES, `${c.slug}.jpg`)).catch(() => null);
      let coverUrl = "";
      if (cover) {
        const key = `site/catalogue-${c.slug}.jpg`;
        await prisma.upload.upsert({ where: { path: key }, update: { data: cover, size: cover.length }, create: { path: key, data: cover, size: cover.length, contentType: "image/jpeg" } });
        coverUrl = `/uploads/${key}`;
      }
      const chunkCount = Math.max(1, Math.ceil(pdf.length / CHUNK_SIZE));
      const row = await prisma.catalogue.create({
        data: { slug: c.slug, title: c.title, description: c.description, fileName: c.fileName, size: pdf.length, chunkCount, coverUrl, sortOrder: order++ },
      });
      for (let i = 0; i < chunkCount; i++) {
        await prisma.catalogueChunk.create({ data: { catalogueId: row.id, index: i, data: pdf.subarray(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE) } });
      }
      await prisma.catalogue.update({ where: { id: row.id }, data: { ready: true } });
    }
    console.log(`Created ${catalogues.length} catalogues`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
