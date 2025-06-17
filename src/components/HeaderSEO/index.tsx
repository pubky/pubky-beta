interface SeoMetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function getPWAConfig() {
  return {
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black',
      title: 'Pubky.app'
    },
    icons: {
      icon: '/images/pubky-logo.svg',
      apple: [
        {
          url: '/web-app-manifest-192x192.png',
          sizes: '180x180',
          type: 'image/png'
        }
      ],
      shortcut: '/images/pubky-logo.svg'
    }
  };
}

export function getHeaderMetaTags() {
  return (
    <>
      {/* Viewport for mobile devices */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=contain"
      />

      {/* PWA icons for iOS */}
      <link rel="apple-touch-icon" sizes="180x180" href="/web-app-manifest-192x192.png" />
      <link rel="apple-touch-startup-image" href="/web-app-manifest-512x512.png" />

      {/* Regular favicon for desktop browsers */}
      <link rel="icon" type="image/svg+xml" href="/images/pubky-logo.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/web-app-manifest-192x192.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/web-app-manifest-192x192.png" />

      {/* Manifest and other PWA configs */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/images/pubky-logo.svg" color="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="Pubky.app" />
    </>
  );
}

export function getSeoMetadata(params: SeoMetadataParams = {}) {
  const {
    title = 'Pubky.app | Unlock the web',
    description = 'Unlock the web. Your keys, your content, your rules.',
    keywords = ['key', 'public key', 'pubkey', 'pubky', 'pkarr', 'pubky core', 'web'],
    image = '/images/webp/pubky-seo.webp',
    url = 'https://pubky.app'
  } = params;

  return {
    metadataBase: new URL('https://pubky.app'),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      site_name: 'Pubky.app'
    },
    twitter: {
      handle: '@getpubky',
      site: '@getpubky',
      cardType: 'summary_large_image'
    }
  };
}

export function getPlausibleScript() {
  // Don't load Plausible script when explicitly disabled
  if (process.env.NEXT_ENABLE_PLAUSIBLE === 'false') {
    return null;
  }

  return <script defer data-domain="pubky.app" src="https://synonym.to/js/script.js" />;
}

const HeaderSEO = {
  getPWAConfig,
  getHeaderMetaTags,
  getSeoMetadata,
  getPlausibleScript
};

export default HeaderSEO;
