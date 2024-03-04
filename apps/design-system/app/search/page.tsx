import { Content } from '@social/ui-shared';
import { CreatePost, Header, ListPost, Post, PostsLayout } from '../components';
import { Search } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header
        title="Search"
        tags={[{ value: '#Bitcoin', color: 'bg-amber-500 bg-opacity-30' }]}
      />
      <Search.Filter />
      <Content.Grid>
        <PostsLayout className="grid grid-cols-2 gap-4">
          <Post />
          <Post />
        </PostsLayout>
        <PostsLayout className="grid grid-cols-3 gap-4">
          <Post />
          <Post />
          <Post />
        </PostsLayout>
        <PostsLayout className="flex flex-col gap-4">
          <Post />
          <ListPost />
        </PostsLayout>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
