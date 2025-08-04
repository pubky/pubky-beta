import { getSeoMetadata } from '@/components/HeaderSEO';
import { Profile } from './components/index';
import LayoutProfile from './components/_LayoutProfile';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/profile'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <LayoutProfile>
      <Profile.NotificationsProfile />
    </LayoutProfile>
  );
}
