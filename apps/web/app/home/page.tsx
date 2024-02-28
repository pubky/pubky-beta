import { Content } from '@social/ui-shared';
import { Home } from './components';
import { CreatePost, Header, PostList } from '../components';

export default function Index() {
  return (
    <Content.Main>
      <Header title="Streams" />
      <Home.Filter />
      <Content.Grid className="gap-6 flex justify-between">
        <PostList />
        <Home.Sidebar />
        <CreatePost />
      </Content.Grid>
    </Content.Main>
  );
}
