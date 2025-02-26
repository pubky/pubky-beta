import { getSeoMetadata } from '@components/HeaderSEO';
import LayoutProfile from '../components/_LayoutProfile';
import ContactsProfile from '../components/_ContactsProfile/ContactsProfile';

export const metadata = getSeoMetadata({
  title: 'Following | Pubky.app',
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <LayoutProfile>
      <ContactsProfile contacts="following" />
    </LayoutProfile>
  );
}
