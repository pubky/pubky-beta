import { getSeoMetadata } from './../../components/HeaderSEO';
import { HotTags } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Hot Tags | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return <HotTags.Content />;
}
