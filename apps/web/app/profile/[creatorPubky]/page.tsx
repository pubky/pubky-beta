'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import { CreatePost, Header, PostsLayout } from '@/components';
import { useClientContext } from '@/contexts';
import { INewPost, IUserProfile } from '@/types';
import { Profile } from '../components';
import { Profile as ProfileCommon } from '../components';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const { getUserIndexed, setPosts } = useClientContext();
  const creatorPubky = params.creatorPubky;

  const [profile, setProfile] = useState<IUserProfile | undefined>();
  const [loading, setLoading] = useState(true);
  const [countContacts, setCountContacts] = useState({
    followers: 0,
    following: 0,
    friends: 0,
  });
  const [userExist, setUserExist] = useState(true);

  const loader = useRef(null);

  async function fetchProfile() {
    try {
      const userProfile = await getUserIndexed(creatorPubky);

      if (userProfile && userProfile.profile) {
        setProfile(userProfile);
        setCountContacts({
          followers: userProfile.followersCount,
          following: userProfile.followingCount,
          friends: userProfile.friendsCount,
        });
      } else {
        setUserExist(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setPosts({} as INewPost);
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content;
  if (userExist) {
    content = (
      <>
        <div>
          <Content.Grid className="flex flex-col text-start lg:flex-row items-center gap-8 relative">
            <ProfileCommon.Avatar
              username={profile?.profile?.name || 'Loading...'}
              uriImage={profile?.profile?.image || '/images/Userpic.png'}
            />
            <ProfileCommon.Handle
              className="-mt-4"
              username={profile?.profile?.name || 'Loading...'}
              pubkey={creatorPubky ?? ''}
              creatorPubky={creatorPubky}
              status={profile?.profile?.status}
            />
          </Content.Grid>
        </div>
        <Content.Grid className="grid grid-cols-5 gap-2">
          <PostsLayout className="flex flex-col col-span-5 xl:col-span-4 gap-3 mt-[10px]">
            <Profile.FilterTabs
              countContacts={countContacts}
              countPosts={profile?.postsCount}
              creatorPubky={creatorPubky}
              loading={loading}
              profile={profile}
            />
          </PostsLayout>
          <Profile.Sidebar creatorPubky={creatorPubky} />
        </Content.Grid>
        <CreatePost />
        <div ref={loader} />
      </>
    );
  } else {
    content = (
      <Content.Grid>
        <div className="px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
          <Typography.Body
            variant="small"
            className="text-opacity-50 text-center"
          >
            This profile was not found or has been deleted by its author.
            <Link
              href="/home"
              className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer"
            >
              Go home
            </Link>
          </Typography.Body>
        </div>
      </Content.Grid>
    );
  }

  return (
    <Content.Main>
      <Header className="hidden md:block" />
      {content}
    </Content.Main>
  );
}
