import { getSeoMetadata } from '@/components/HeaderSEO';
import { Permissions } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Permissions | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return <Permissions.Content />;
}
