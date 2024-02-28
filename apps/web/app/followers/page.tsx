import { Content } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { Followers } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header title="Followers" />
      <Followers.Filter />
      <Content.Grid>
        <Followers.Root title="517 followers">
          <Followers.Follower />
          <Followers.Follower />
        </Followers.Root>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
