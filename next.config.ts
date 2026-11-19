import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a test build go to another folder (NEXT_DIST_DIR=.next-check) while `npm run dev` keeps using .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    // Image uploads go through server actions. Vercel caps requests at 4.5 MB, so keep in line with that.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  poweredByHeader: false,
  // The Gallery page was renamed; keep old links and search results working
  async redirects() {
    return [{ source: "/gallery", destination: "/product-installation", permanent: true }];
  },
};

export default nextConfig;
