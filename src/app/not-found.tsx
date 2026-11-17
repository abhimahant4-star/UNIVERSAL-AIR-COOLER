import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="text-6xl font-extrabold text-brand-600">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Go to Home
          </Link>
          <Link href="/products" className="btn-outline">
            View Products
          </Link>
        </div>
      </div>
    </main>
  );
}
