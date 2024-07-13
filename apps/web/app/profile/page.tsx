'use client';

import { useEffect, useRef, useState } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, PostsLayout } from '@/components';
import { useClientContext } from '@/contexts';
import { TStatus } from '@/types';
import { Profile } from './components';

export default function Index() {
  const { pubky, getUserIndexed } = useClientContext();
  const [status, setStatus] = useState<TStatus | undefined>();
  const [pic, setPic] = useState('/images/Userpic.png');
  const [name, setName] = useState('');
  const [handler, setHandler] = useState('');
  const [countPosts, setCountPosts] = useState<number>();
  const [countContacts, setCountContacts] = useState({
    followers: 0,
    following: 0,
    friends: 0,
  });
  const loader = useRef(null);

  async function fetchProfile() {
    try {
      if (!pubky) return;
      const userProfile = await getUserIndexed(pubky);
      console.log('userProfile', userProfile);

      if (userProfile) {
        setPic(userProfile.profile?.image || '/images/Userpic.png');
        setName(userProfile.profile?.name || 'Loading...');
        setHandler(pubky);
        setStatus(userProfile.profile?.status);
        setCountPosts(userProfile.postsCount);
        setCountContacts({
          followers: userProfile.followersCount,
          following: userProfile.followersCount,
          friends: userProfile.friendsCount,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Profile" />
      <div>
        <Content.Grid className="flex flex-col text-center lg:flex-row items-center gap-8 relative">
          <Profile.Avatar username={name} src={pic} />
          <Profile.Handle
            className="-mt-4"
            username={name}
            pubkey={handler}
            status={status}
          />
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-3 gap-4">
        <PostsLayout className="flex flex-col col-span-3 xl:col-span-2 gap-6 mt-[10px]">
          <Profile.FilterTabs
            countContacts={countContacts}
            countPosts={countPosts}
          />
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
