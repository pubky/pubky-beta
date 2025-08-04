import { getSeoMetadata } from '@components/HeaderSEO';
import { Onboarding } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/onboarding'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Onboarding.Content />;
}
