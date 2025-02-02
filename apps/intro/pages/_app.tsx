import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import NextTopLoaderComponent from '../components/NextTopLoader';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Pubky | Unlock the web.</title>
        <link rel="shortcut icon" href="/images/pubky-logo.svg" />

        <meta
          name="description"
          content="Unlock the web. Your keys, your content, your rules."
        />
        <meta
          name="keywords"
          content="pubky, self sovereignty, key, public key, pubkey, open source software"
        />
        <meta property="og:title" content="Pubky | Unlock the web." />
        <meta property="og:site_name" content="Pubky | Unlock the web." />
        <meta
          property="og:description"
          content="Unlock the web. Your keys, your content, your rules."
        />
        <meta
          property="og:image"
          content="https://pubky.app/images/webp/pubky-seo.webp"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@getpubky" />
        <meta name="twitter:title" content="Pubky | Unlock the web." />
        <meta
          name="twitter:description"
          content="Unlock the web. Your keys, your content, your rules."
        />
        <meta
          name="twitter:image"
          content="https://pubky.app/images/webp/pubky-seo.webp"
        />
      </Head>
      <main className="app">
        <NextTopLoaderComponent>
          <Component {...pageProps} />
        </NextTopLoaderComponent>
      </main>
    </>
  );
}

export default CustomApp;
