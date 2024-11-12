interface SeoMetadataParams {
  title?: string;
  description?: string;
  keywords?: string[];
  icon?: string;
  image?: string;
  url?: string;
  twitterHandle?: string;
}

export function getSeoMetadata({
  title = 'Pubky.app | Unlock the web',
  description = 'Unlock the web. Your keys, your content, your rules.',
  keywords = [
    'key',
    'public key',
    'pubkey',
    'pubky',
    'pkarr',
    'pubky core',
    'web',
  ],
  icon = '/images/webp/pubky-logo.webp',
  image = '/images/webp/pubky-seo.webp',
  url = 'https://synonym.to',
  twitterHandle = '@getpubky',
}: SeoMetadataParams) {
  return {
    title,
    description,
    keywords,
    icons: {
      icon,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: `https://synonym.to${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      site_name: 'Pubky.app',
    },
    twitter: {
      handle: twitterHandle,
      site: twitterHandle,
      cardType: 'summary_large_image',
    },
  };
}
