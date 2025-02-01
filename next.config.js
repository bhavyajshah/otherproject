/** @type {import('next').NextConfig} */

const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  optimizeFonts: true,
  images: {
    domains: [
      "mis-express.com",
      "www.mis-express.com",
      "tyranshop.com",
      "localhost:3001",
      "localhost:3000",
      "localhost",
      "drive.google.com",
      "me-gateway-app-dev",
    ],
    minimumCacheTTL: 1500000,
  },
};

module.exports = withNextIntl(nextConfig);
