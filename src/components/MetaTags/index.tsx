import Head from 'next/head';

interface MetaTagsProps {
  username: string;
  description: string;
  url: string;
  image?: string;
  video?: string;
}

const MetaTags = ({ username, description, url, image, video }: MetaTagsProps) => {
  return (
    <Head>
      <meta property="og:title" content={username} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {video ? (
        <>
          <meta property="og:video" content={video} />
          <meta property="og:video:type" content="video/mp4" />
        </>
      ) : (
        image && <meta property="og:image" content={image} />
      )}
      <meta property="og:type" content={video ? 'video.other' : 'article'} />

      {/* Meta Tags Twitter */}
      <meta name="twitter:title" content={username} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content={url} />
      {video ? (
        <>
          <meta name="twitter:player" content={video} />
          <meta name="twitter:card" content="player" />
        </>
      ) : (
        image && <meta name="twitter:image" content={image} />
      )}
      {!video && <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />}

      {/* iOS and PWA Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="Pubky.app" />
      <link rel="apple-touch-icon" sizes="180x180" href="/web-app-manifest-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/web-app-manifest-192x192.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/web-app-manifest-192x192.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="shortcut icon" href="/web-app-manifest-192x192.png" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />
    </Head>
  );
};

export default MetaTags;
