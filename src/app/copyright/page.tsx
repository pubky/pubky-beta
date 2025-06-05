import { getSeoMetadata } from '@components/HeaderSEO';
import { Copyright } from './components';

export const metadata = getSeoMetadata({
  title: 'Copyright | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Copyright.Page />;
}
