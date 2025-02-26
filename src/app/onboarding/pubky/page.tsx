import { getSeoMetadata } from '@components/HeaderSEO';
import { Pubky } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Pubky | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Pubky.Content />;
}
