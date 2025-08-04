import { getSeoMetadata } from '@components/HeaderSEO';
import { SignIn } from './components/index';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/sign-in'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <SignIn.Content />;
}
