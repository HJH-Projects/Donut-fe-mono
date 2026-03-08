import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    deviceSizes: [64, 96, 128, 256, 320, 352, 384, 512, 640, 768, 1024],
    imageSizes: [16, 24, 32, 48, 60, 72, 96, 128, 160, 192],
    formats: ['image/webp'],
  },
};

export default nextConfig;
