import { getSeoMetadata } from '@components/HeaderSEO';
import { Logout } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Logout | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Logout.Content />;
}
