import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from '../components';
import { Section } from '../sections';

export const metadata = getSeoMetadata({
  title: 'Notifications | Settings',
  description: 'Pubky.app - Unlock the web.'
});

export default function NotificationsPage() {
  return (
    <Settings.Layout>
      <Section.Notifications />
    </Settings.Layout>
  );
}
