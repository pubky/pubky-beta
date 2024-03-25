import { Content } from '@social/ui-shared';
import { CreatePost, Header, Post, PostsLayout } from '../components';
import { DropDown } from '../components/DropDown';

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Bookmarks">
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Content />
          <DropDown.Reach />
          <DropDown.SortPosts />
          <DropDown.Layout />
        </div>
      </Header>
      <Content.Grid>
        <PostsLayout className="inline-flex flex-col gap-6">
          <Post repost bookmark />
          <Post bookmark />
          <Post bookmark />
          <Post bookmark />
          <Post bookmark />
          <Post bookmark />
          <Post repost bookmark />
        </PostsLayout>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
