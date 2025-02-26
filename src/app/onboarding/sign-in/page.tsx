import { getSeoMetadata } from '@components/HeaderSEO';
import { SignIn } from './components/index';

export const metadata = getSeoMetadata({
  title: 'SignIn | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <SignIn.Content />;
}
