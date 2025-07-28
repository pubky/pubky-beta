import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/settings'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Settings.Content />;
}
