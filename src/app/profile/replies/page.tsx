import { getSeoMetadata } from '@components/HeaderSEO';
import LayoutProfile from '../components/_LayoutProfile';
import { Profile } from '../components';

export const metadata = getSeoMetadata({
  title: 'Replies | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <LayoutProfile>
      <Profile.Replies />
    </LayoutProfile>
  );
}
