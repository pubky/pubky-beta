import { getSeoMetadata } from '@components/HeaderSEO';
import { Hot } from '@app/hot/components';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/hot'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Hot.Content />;
}
