interface SeoMetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  icon?: string;
  image?: string;
  url?: string;
  twitterHandle?: string;
  statusBarStyle?: 'default' | 'black-translucent';
}

export function getSeoMetadata({
  title = 'Pubky.app | Unlock the web',
  description = 'Unlock the web. Your keys, your content, your rules.',
  keywords = ['key', 'public key', 'pubkey', 'pubky', 'pkarr', 'pubky core', 'web'],
  icon = '/images/pubky-logo.svg',
  image = '/images/webp/pubky-seo.webp',
  url = 'https://pubky.app',
  twitterHandle = '@getpubky',
  statusBarStyle = 'default'
}: SeoMetadataParams) {
  return {
    title,
    description,
    keywords,
    icons: {
      icon,
      apple: [
        {
          url: '/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        }
      ]
    },
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
      handle: twitterHandle,
      site: twitterHandle,
      cardType: 'summary_large_image'
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: statusBarStyle,
      title: title
    }
  };
}
