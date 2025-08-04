import { getSeoMetadata } from '@components/HeaderSEO';
import { Register } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/onboarding/register'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Register.Content />;
}
