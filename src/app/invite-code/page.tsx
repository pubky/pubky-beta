import { getSeoMetadata } from '@components/HeaderSEO';
import { InviteCode } from './components';

export const metadata = getSeoMetadata({
  title: 'Invite Code | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return <InviteCode.Content />;
}
