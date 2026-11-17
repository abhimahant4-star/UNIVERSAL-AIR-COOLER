import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import { saveProduct } from "../../../actions";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [product, categories] = await Promise.all([
    Number.isInteger(id) ? prisma.product.findUnique({ where: { id } }) : null,
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Edit Product</h1>
      <ProductForm product={product} categories={categories} action={saveProduct.bind(null, product.id)} />
    </div>
  );
}
