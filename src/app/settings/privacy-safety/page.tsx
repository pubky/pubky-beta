import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from '../components';
import { Section } from '../sections';

export const metadata = getSeoMetadata({
  title: 'Privacy & Safety | Settings',
  description: 'Pubky.app - Unlock the web.'
});

export default function PrivacySafetyPage() {
  return (
    <Settings.Layout>
      <Section.PrivacySafety />
    </Settings.Layout>
  );
}
