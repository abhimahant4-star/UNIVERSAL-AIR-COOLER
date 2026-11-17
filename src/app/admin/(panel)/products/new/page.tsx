import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/db";
import { saveProduct } from "../../../actions";

export default async function NewProduct() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Add Product</h1>
      <ProductForm categories={categories} action={saveProduct.bind(null, null)} />
    </div>
  );
}
