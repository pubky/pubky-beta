import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from '../components';
import { Section } from '../sections';

export const metadata = getSeoMetadata({
  title: 'Language | Settings',
  description: 'Pubky.app - Unlock the web.'
});

export default function LanguagePage() {
  return (
    <Settings.Layout>
      <Section.Language />
    </Settings.Layout>
  );
}
