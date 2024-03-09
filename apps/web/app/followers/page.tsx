import { Content } from '@social/ui-shared';
import { CreatePost, Header } from '../components';
import { Followers } from './components';

export default function Index() {
  return (
    <Content.Main>
      <Header
        className="hidden w-[400px] xl:w-[260px] md:block"
        title="John's&#160;Followers"
      />
      <Followers.Me />
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
