import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from '../components';
import { Section } from '../sections';

export const metadata = getSeoMetadata({
  title: 'Copyright | Settings',
  description: 'Pubky.app - Unlock the web.'
});

export default function CopyrightPage() {
  return (
    <Settings.Layout>
      <Section.Copyright />
    </Settings.Layout>
  );
}
