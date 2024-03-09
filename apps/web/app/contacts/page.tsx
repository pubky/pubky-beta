import { Content } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { Contacts } from './components';
import { DropDown } from '../components/DropDown';

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Contacts">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Reach />
          <DropDown.SortFriends />
          <DropDown.ContactsLayout />
        </div>
      </Header>
      <Content.Grid>
        <Contacts.Contact />
        <Contacts.Contact />
        <Contacts.Contact />
        <Contacts.Contact />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
