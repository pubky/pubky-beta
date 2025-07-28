import { getSeoMetadata } from '@components/HeaderSEO';
import { Pubky } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/onboarding/pubky'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Pubky.Content />;
}
