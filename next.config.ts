// Method 1: Modify next.config.js to skip type checking
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optional: Also skip ESLint if you want
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
