/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  // "archiver" (usado en /api/admin/certificados/emision/[emisionId]/zip) trae
  // como dependencia "readdir-glob", cuyo package.json tiene el campo
  // "exports" con condiciones en un orden que el resolutor estricto de
  // webpack rechaza ("Default condition should be last one"). Se excluye del
  // bundle de webpack para que se resuelva con require() nativo de Node.
  experimental: {
    serverComponentsExternalPackages: ["archiver"],
  },
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
