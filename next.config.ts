import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/workflows",
        permanent: true,
      },
      {
        source: "/settings",
        destination: "/settings/profile",
        permanent: true,
      },
    ];
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
