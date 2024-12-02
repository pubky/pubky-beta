import { getSeoMetadata } from '@components/HeaderSEO';
import { Profile } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Profile | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return <Profile.Content />;
}
