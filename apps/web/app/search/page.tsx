import { Content } from '@social/ui-shared';
import { CreatePost, Header, Post, PostsLayout } from '../components';
import { DropDown } from '../components/DropDown';

export default function Index() {
  return (
    <Content.Main>
      <Header
        className="hidden md:block"
        title="Search"
        tags={[{ value: '#Bitcoin', color: 'bg-amber-500 bg-opacity-30' }]}
      >
        <div className="hidden lg:flex gap-6 items-center">
          <DropDown.Content />
          <DropDown.Reach />
          <DropDown.SortPosts />
          <DropDown.Layout />
        </div>
      </Header>
      <Content.Grid>
        <PostsLayout className="w-full flex-col inline-flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Post />
          <Post />
        </PostsLayout>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
