import { Content } from '@social/ui-shared';
import { CreatePost, Header, ListPost, Post, PostsLayout } from '../components';
import { BookMark } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header title="Bookmarks" />
      <BookMark.Filter />
      <Content.Grid>
        <PostsLayout className="grid grid-cols-3 gap-4">
          <Post repost />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </PostsLayout>
        <ListPost repost />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
