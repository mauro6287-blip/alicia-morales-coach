/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/servicios",
        destination: "/programa-de-insercion-laboral",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
