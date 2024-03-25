import { Content } from '@social/ui-shared';
import { Post } from './components';
import { CreatePost, Header } from '../components';

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Post" />
      <Content.Grid className="flex justify-between flex-col gap-12">
        <Post.MainPost />
        <Post.ReplyForm />
        <Post.Replies />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
