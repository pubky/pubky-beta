'use client';

import { Content } from '@social/ui-shared';
import { Home } from './components';
import {
  ActiveFriends,
  CreatePost,
  Header,
  HotTags,
  Post,
  PostsLayout,
  Sidebar,
  WhoFollow,
} from '../components';

import Client from '@pubky/client';

const DEFAULT_HOME_SERVER = 'http://localhost:7259';
const DEFAULT_RELAY = 'https://relay.pkarr.org';

export default function Index() {
  const pubkyClient = new Client(DEFAULT_HOME_SERVER, {
    relay: DEFAULT_RELAY,
    homeserverUrl: DEFAULT_HOME_SERVER,
  });
  pubkyClient.ready().then(() => {
    console.log('Pubky client is ready');
  });
  pubkyClient.signup(Client.crypto.generateSeed()).then((result: unknown) => {
    console.log(result);
  });
  return (
    <Content.Main>
      <Header className="hidden md:block" title="Streams" />
      <Home.Filter />
      <Content.Grid className="grid grid-cols-3 gap-4">
        <PostsLayout className="col-span-3 xl:col-span-2">
          <Post />
        </PostsLayout>
        <Sidebar className="hidden xl:inline-flex">
          <WhoFollow />
          <HotTags />
          <ActiveFriends />
        </Sidebar>
      </Content.Grid>
      <CreatePost />
    </Content.Main>
  );
}
