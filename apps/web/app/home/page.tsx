import { Content } from '@social/ui-shared';
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
import { DropDown } from '../components/DropDown';

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Streams">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Content />
          <DropDown.Reach />
          <DropDown.SortPosts />
          <DropDown.Layout />
        </div>
      </Header>
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
