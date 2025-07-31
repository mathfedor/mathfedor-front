/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname + '/src';
    return config;
  }
}

module.exports = nextConfig 