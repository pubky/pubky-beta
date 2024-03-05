import { Content } from '@social/ui-shared';
import { Home } from './components';
import {
  ActiveFriends,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
} from '../components';

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Streams" />
      <Home.Filter />
      <Content.Grid className="grid grid-cols-3 gap-4">
        <PostsLayout className="col-span-3 xl:col-span-2">
          <Post />
        </PostsLayout>
        <Sidebar className="hidden xl:inline-flex">
          <WhoFollow />
          <HotTags />
          <ActiveFriends />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
