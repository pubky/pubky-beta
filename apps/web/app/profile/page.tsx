import { Content } from '@social/ui-shared';
import { Profile } from './components';
import { CreatePost, Header, PostList } from '../components';

export default function Index() {
  return (
    <Content.Main>
      <Header title="Profile" />
      <Profile.HeaderBackground />
      <Content.Grid>
        <Profile.Info username="Satoshi Nakamoto" src="/images/user.png" />
      </Content.Grid>
      <Content.Grid className="mt-6 gap-6 flex justify-between">
        <PostList />
        <Profile.Sidebar />
        <CreatePost />
      </Content.Grid>
    </Content.Main>
  );
}
