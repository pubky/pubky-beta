import Head from 'next/head';

interface HeaderSEOProps {
  title?: string;
  icon?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export const HeaderSEO = ({
  title = 'Pubky.app | Unlock the web',
  icon = '/images/webp/pubky-logo.webp',
  description = 'Unlock the web. Your keys, your content, your rules.',
  keywords = 'key, public key, pubkey, pubky, pkarr, pubky core, web',
  image = '/images/webp/pubky-seo.webp',
}: HeaderSEOProps) => {
  const imageUrl = `https://synonym.to${image}`;
  const twitterHandle = '@getpubky';

  return (
    <Head>
      <title>{title}</title>
      <link rel="shortcut icon" href={icon} />

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};
