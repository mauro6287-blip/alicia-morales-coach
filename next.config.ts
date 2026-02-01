import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  poweredByHeader: false,


  // Trailing slash for better static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
