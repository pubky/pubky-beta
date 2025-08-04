import { getSeoMetadata } from '@components/HeaderSEO';
import { SignUp } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/onboarding/sign-up'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <SignUp.Content />;
}
