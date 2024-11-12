import { getSeoMetadata } from './../../components/HeaderSEO';
import { Influencers } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Influencers | Pubky.app',
  description: 'Pubky.app - Unlock the web.',
});

export default function Index() {
  return <Influencers.Content />;
}
