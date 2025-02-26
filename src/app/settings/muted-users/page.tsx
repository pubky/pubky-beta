import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from '../components';
import { Section } from '../sections';

export const metadata = getSeoMetadata({
  title: 'Muted Users | Settings',
  description: 'Pubky.app - Unlock the web.'
});

export default function MutedUsersPage() {
  return (
    <Settings.Layout>
      <Section.MutedUsers />
    </Settings.Layout>
  );
}
