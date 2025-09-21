const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  assetPrefix: isProd ? './' : '',
};

export default nextConfig;