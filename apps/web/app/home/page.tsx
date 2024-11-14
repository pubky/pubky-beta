import { getSeoMetadata } from './../../components/HeaderSEO';
import { HomePage } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Home | Pubky.app',
  description: 'Welcome to Pubky.app - Unlock the web.',
});

export default function Index() {
  return <HomePage.Content />;
}
