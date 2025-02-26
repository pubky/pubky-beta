import { Error404 } from '@/components/404';
import { getSeoMetadata } from '@components/HeaderSEO';

export const metadata = getSeoMetadata({
  title: '404 | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Custom404() {
  return <Error404.Content />;
}
