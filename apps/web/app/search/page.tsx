import { Content } from '@social/ui-shared';
import { CreatePost, Header, Post, PostsLayout } from '../components';
import { Search } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header
        className="hidden md:block"
        title="Search"
        tags={[{ value: '#Bitcoin', color: 'bg-amber-500 bg-opacity-30' }]}
      />
      <Search.Filter />
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
