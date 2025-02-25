//@ts-check

// Removed NX integration since it's no longer needed

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
require('dotenv').config({
  path: path.resolve(process.cwd(), '../.env')
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'staging.pubky.app',
      },
      {
        protocol: 'https',
        hostname: 'pubky.app',
      },
      {
        protocol: 'https',
        hostname: 'nexus.staging.pubky.app',
      },
      {
        protocol: 'https',
        hostname: 'nexus.pubky.app',
      },
    ],
  },
  cleanDistDir: false,
  env: {
    NEXT_PUBLIC_HOMESERVER:
      process.env.NEXT_PUBLIC_HOMESERVER || '11111111111111111111111111111111',
  },
  transpilePackages: ['pubky-app-specs'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@synonymdev/pubky');
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
      include: [path.resolve(__dirname, 'pubky-app-specs')],
    });

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@nx/react/tailwind': path.resolve(
        __dirname,
        'stubs/nx-react-tailwind.js',
      ),
    };

    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/onboarding',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
