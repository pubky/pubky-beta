import { getSeoMetadata } from '@components/HeaderSEO';
import { Register } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Register | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Register.Content />;
}
