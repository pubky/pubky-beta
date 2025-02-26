import { getSeoMetadata } from '@components/HeaderSEO';
import { Confirm } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Confirm | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Confirm.Content />;
}
