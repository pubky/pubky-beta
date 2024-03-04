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
      <Header className='hidden md:block' title="Streams" />
      <Home.Filter />
      <Content.Grid className="gap-6 flex justify-between">
        <PostsLayout>
          <Post className="xl:w-[792px]" />
        </PostsLayout>
        <Sidebar className="hidden lg:inline-flex">
          <WhoFollow />
          <HotTags />
          <ActiveFriends />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
