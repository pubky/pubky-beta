import { getSeoMetadata } from '@components/HeaderSEO';
import { Hot } from '@app/hot/components';

export const metadata = getSeoMetadata({
  title: 'Hot | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Hot.Content />;
}
