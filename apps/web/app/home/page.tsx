import { Content } from '@social/ui-shared';
import { Home } from './components';
import { CreatePost, Header, Post, PostsLayout } from '../components';

export default function Index() {
  return (
    <Content.Main>
      <Header title="Streams" />
      <Home.Filter />
      <Content.Grid className="gap-6 flex justify-between">
        <PostsLayout>
          <Post className="w-[792px]" />
        </PostsLayout>
        <Home.Sidebar />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
