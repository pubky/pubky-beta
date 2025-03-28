import { Profile } from './components/index';
import LayoutProfile from './components/_LayoutProfile';

export const metadata = {
  title: 'Profile | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
};

export default function Index() {
  return (
    <LayoutProfile>
      <Profile.NotificationsProfile />
    </LayoutProfile>
  );
}
