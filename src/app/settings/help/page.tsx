import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from '../components';
import { Section } from '../sections';

export const metadata = getSeoMetadata({
  title: 'Help | Settings',
  description: 'Pubky.app - Unlock the web.'
});

export default function HelpPage() {
  return (
    <Settings.Layout>
      <Section.Help />
    </Settings.Layout>
  );
}
