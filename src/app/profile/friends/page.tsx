import { getSeoMetadata } from '@components/HeaderSEO';
import LayoutProfile from '../components/_LayoutProfile';
import ContactsProfile from '../components/_ContactsProfile/ContactsProfile';
import { routeTitleMap } from '@/utils/pageTitles';

export const metadata = getSeoMetadata({
  title: routeTitleMap['/profile/friends'],
  description: 'Pubky.app - Unlock the web.'
});

export default function Index() {
  return (
    <LayoutProfile>
      <ContactsProfile contacts="friends" />
    </LayoutProfile>
  );
}
