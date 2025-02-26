import { getSeoMetadata } from '@components/HeaderSEO';
import { Edit } from './components/index';

export const metadata = getSeoMetadata({
  title: 'Edit | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return <Edit.Content />;
}
