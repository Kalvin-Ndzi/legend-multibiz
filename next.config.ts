/**
 * NEXT.JS CONFIG — Legend Multibiz
 *
 * images.remotePatterns: allow loading images from Unsplash (used for demo).
 *
 * When you add Supabase Storage images, add a new entry:
 *   { protocol: "https", hostname: "YOUR-ID.supabase.co" }
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
