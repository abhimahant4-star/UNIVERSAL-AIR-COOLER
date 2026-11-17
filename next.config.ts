import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Image uploads go through server actions. Vercel caps requests at 4.5 MB, so keep in line with that.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
  poweredByHeader: false,
};

export default nextConfig;
