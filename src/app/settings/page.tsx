import { getSeoMetadata } from '@components/HeaderSEO';
import { Settings } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Settings | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Settings.Content />;
}
