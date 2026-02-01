import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Hostinger (or any static hosting)
  output: "export",

  // Performance optimizations
  poweredByHeader: false,

  // Image optimization (unoptimized for static export)
  images: {
    unoptimized: true, // Required for static export
  },

  // Trailing slash for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
