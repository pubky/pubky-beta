import { getSeoMetadata } from './../../components/HeaderSEO';
import { Notifications } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Notifications | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return <Notifications.Content />;
}
