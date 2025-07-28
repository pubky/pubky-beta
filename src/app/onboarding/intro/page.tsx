import { getSeoMetadata } from '@components/HeaderSEO';
import { Intro } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/onboarding/intro'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Intro.Content />;
}
