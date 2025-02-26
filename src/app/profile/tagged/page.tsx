import { getSeoMetadata } from '@components/HeaderSEO';
import LayoutProfile from '../components/_LayoutProfile';
import TaggedAs from '../components/_TaggedAs';

export const metadata = getSeoMetadata({
  title: 'Tagged as | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <LayoutProfile>
      <TaggedAs />
    </LayoutProfile>
  );
}
