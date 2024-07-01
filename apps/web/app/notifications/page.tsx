import { Content } from '@social/ui-shared';
import {
  CreatePost,
  Header,
  HotTags,
  Sidebar,
  WhoFollow,
} from '../../components';
import { Notifications } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Notifications" />
      <Content.Grid className="flex w-full justify-between items-start gap-12">
        <Notifications.Root>
          <Notifications.Notification />
          <Notifications.Notification />
          <Notifications.Notification />
        </Notifications.Root>
        <Sidebar className="self-start sticky top-[120px] hidden xl:block w-[20%]">
          <WhoFollow />
          <HotTags />
        </Sidebar>{' '}
      </Content.Grid>
      <CreatePost />
      <CreatePost />
    </Content.Main>
  );
}
