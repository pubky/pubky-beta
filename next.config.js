//@ts-check
const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'staging.pubky.app'
      },
      {
        protocol: 'https',
        hostname: 'pubky.app'
      },
      {
        protocol: 'https',
        hostname: 'nexus.staging.pubky.app'
      },
      {
        protocol: 'https',
        hostname: 'nexus.pubky.app'
      }
    ]
  },
  env: {
    NEXT_PUBLIC_HOMESERVER: process.env.NEXT_PUBLIC_HOMESERVER || '11111111111111111111111111111111'
  },
  transpilePackages: ['pubky-app-specs'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@synonymdev/pubky');
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true
    };

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/onboarding',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
