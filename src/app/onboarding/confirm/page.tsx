import { getSeoMetadata } from '@components/HeaderSEO';
import { Confirm } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/onboarding/confirm'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Confirm.Content />;
}
