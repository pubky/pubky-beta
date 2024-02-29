import { Content } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { Followers } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header title="John's Followers" className="w-[260px]" />
      <Followers.Filter />
      <Content.Grid>
        <Followers.Root>
          <Followers.Follower />
          <Followers.Follower />
        </Followers.Root>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
