import { getSeoMetadata } from '@/components/HeaderSEO';
import { Search } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Search | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return <Search.Content />;
}
