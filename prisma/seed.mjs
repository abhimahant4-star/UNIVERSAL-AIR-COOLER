// Seeds the first admin user, categories, products and gallery images (data in ./catalog.mjs).
// Safe to re-run: products and gallery are only created when those tables are empty.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFile } from "fs/promises";
import path from "path";
import { categories, gallery, products } from "./catalog.mjs";

const prisma = new PrismaClient();
const SEED_IMAGES = path.join(process.cwd(), "prisma", "seed-images");

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
  const email = process.env.ADMIN_EMAIL || "admin@universalaircooler.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  if (!(await prisma.admin.findUnique({ where: { email } }))) {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
