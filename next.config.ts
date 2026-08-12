import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholders locais em /public/placeholders são SVG — precisa liberar
    // explicitamente para o otimizador de imagem do Next.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
