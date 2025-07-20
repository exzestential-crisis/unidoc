/** @type {import('next').NextConfig} */
const nextConfig = {
  // Make sure you don't have logging disabled
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
