import { getSeoMetadata } from '@components/HeaderSEO';
import { Intro } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Intro | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Intro.Content />;
}
