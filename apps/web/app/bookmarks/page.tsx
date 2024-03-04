import { Content } from '@social/ui-shared';
import { CreatePost, Header, Post, PostsLayout } from '../components';
import { BookMark } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header title="Bookmarks" />
      <BookMark.Filter />
      <Content.Grid>
        <PostsLayout className="grid gap-4">
          <Post repost bookmark />
          <Post bookmark />
          <Post bookmark />
          <Post bookmark />
          <Post bookmark />
          <Post bookmark />
        </PostsLayout>
        <Post repost bookmark />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
