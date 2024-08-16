'use client';

import { useEffect, useRef, useState } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, PostsLayout } from '@/components';
import { useClientContext } from '@/contexts';
import { IUserProfile } from '@/types';
import { Profile } from './components';

export default function Index() {
  const { pubky, getUserIndexed } = useClientContext();
  const [profile, setProfile] = useState<IUserProfile | undefined>();
  const [loading, setLoading] = useState(true);
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

      if (userProfile) {
        setProfile(userProfile);
        setCountContacts({
          followers: userProfile.followersCount,
          following: userProfile.followingCount,
          friends: userProfile.friendsCount,
        });
      }
      setLoading(false);
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
          <Profile.Avatar
            username={profile?.profile?.name || 'Loading...'}
            uriImage={profile?.profile?.image}
          />
          <Profile.Handle
            className="-mt-4"
            username={profile?.profile?.name || 'Loading...'}
            pubkey={pubky ? pubky : ''}
            status={profile?.profile?.status}
          />
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-5 gap-2">
        <PostsLayout className="flex flex-col col-span-5 xl:col-span-4 gap-3 mt-[10px]">
          <Profile.FilterTabs
            countContacts={countContacts}
            countPosts={profile?.postsCount}
            loading={loading}
          />
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
