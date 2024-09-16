'use client';

import { useRef } from 'react';
import { Content } from '@social/ui-shared';
import { CreatePost, Header, PostsLayout } from '@/components';
import { Profile } from './components';
import { useUserProfile } from '@/hooks/useUser';

export default function Index() {
  const pubky = '3iwsuz58pgrf7nw4kx8mg3fib1kqyi4oxqmuqxzsau1mpn5weipo';
  const { data, isLoading } = useUserProfile(pubky);
  const profile = data;
  const loader = useRef(null);

  return (
    <Content.Main>
      <Header className="hidden md:block" title="Profile" />
      <div>
        <Content.Grid className="flex flex-col text-center lg:flex-row items-center gap-8 relative">
          <Profile.Avatar
            username={profile?.details?.name || 'Loading...'}
            uriImage={profile?.details?.image}
          />
          <Profile.Handle
            className="-mt-4"
            username={profile?.details?.name || 'Loading...'}
            pubkey={pubky ? pubky : ''}
            status={profile?.details?.status}
          />
        </Content.Grid>
      </div>
      <Content.Grid className="grid grid-cols-5 gap-2">
        <PostsLayout className="flex flex-col col-span-5 xl:col-span-4 gap-3 mt-[10px]">
          <Profile.FilterTabs
            countContacts={{
              followers: profile?.counts?.followers ?? 0,
              following: profile?.counts?.following ?? 0,
              friends: profile?.counts?.friends ?? 0,
            }}
            countPosts={profile?.counts?.posts}
            loading={isLoading}
            profile={profile}
          />
        </PostsLayout>
        <Profile.Sidebar />
      </Content.Grid>
      <CreatePost />
      <div ref={loader} />
    </Content.Main>
  );
}
