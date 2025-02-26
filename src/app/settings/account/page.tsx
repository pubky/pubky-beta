import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from '../components';
import { Section } from '../sections';

export const metadata = getSeoMetadata({
  title: 'Account | Settings',
  description: 'Pubky.app - Unlock the web.'
});

export default function AccountPage() {
  return (
    <Settings.Layout>
      <Section.Account />
    </Settings.Layout>
  );
}
