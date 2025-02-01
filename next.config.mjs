/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:false,
  swcMinify:true,
  optimizeFonts:true,
  images: {
    loader: 'custom',
    loaderFile: './app/imageLoader.ts',
  },
};

export default nextConfig;
