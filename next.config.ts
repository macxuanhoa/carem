import type { NextConfig } from "next";
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // Required for Docker
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'date-fns', '@radix-ui/react-slot', 'clsx', 'tailwind-merge'],
    staleTimes: {
      dynamic: 180, // Cache dynamic data for 3 minutes (Client-side)
      static: 600,  // Cache static pages for 10 minutes
    },
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Parallel Routes & Intercepting Routes optimization
    ppr: 'incremental', 
  },
  logging: {
    fetches: {
      fullUrl: false, // Reduce logs
    },
  },
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withPWA(nextConfig);
