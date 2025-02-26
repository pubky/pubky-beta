import { getSeoMetadata } from '@components/HeaderSEO';
import { Onboarding } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Onboarding | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Onboarding.Content />;
}
