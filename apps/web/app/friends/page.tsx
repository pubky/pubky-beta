import { Content } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { Friends } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Friends" />
      <Friends.Filter />
      <Content.Grid>
        <Friends.Friend />
        <Friends.Friend />
        <Friends.Friend />
        <Friends.Friend />
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
