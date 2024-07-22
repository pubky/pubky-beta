'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import { CreatePost, Header, PostsLayout } from '@/components';
import { useClientContext } from '@/contexts';
import { INewPost, TStatus } from '@/types';
import { Profile } from '../components';
import { Profile as ProfileCommon } from '../components';

export default function Index({
  params,
}: {
  params: { creatorPubky: string };
}) {
  const { pubky, getUserIndexed, setPosts } = useClientContext();
  const creatorPubky = params.creatorPubky;

  const [pic, setPic] = useState('/images/Userpic.png');
  const [status, setStatus] = useState<TStatus | undefined>();
  const [name, setName] = useState('');
  const [handler, setHandler] = useState('');
  const [countPosts, setCountPosts] = useState<number>();
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
      if (pubky === creatorPubky) {
        const user = await getUserIndexed(pubky);
        const userProfile = user?.profile;
        if (userProfile && user) {
          setPic(userProfile.image || '/images/Userpic.png');
          setName(userProfile.name || 'Loading...');
          setHandler(pubky);
          setStatus(userProfile.status);
          setCountPosts(user.postsCount);
          setCountContacts({
            followers: user.followersCount,
            following: user.followersCount,
            friends: user.friendsCount,
          });
        }
        return;
      }
      const userProfile = await getUserIndexed(creatorPubky);

      if (userProfile && userProfile.profile) {
        setPic(userProfile.profile?.image || '/images/Userpic.png');
        setName(userProfile.profile?.name || 'Loading...');
        setHandler(creatorPubky);
        setStatus(userProfile.profile?.status);
        setCountPosts(userProfile.postsCount);
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

  return (
    <Content.Main>
      <Header className="hidden md:block" />
      {userExist ? (
        <>
          <div>
            <Content.Grid className="flex flex-col text-start lg:flex-row items-center gap-8 relative">
              <ProfileCommon.Avatar username={name} src={pic} />
              <ProfileCommon.Handle
                className="-mt-4"
                username={name}
                pubkey={handler}
                creatorPubky={creatorPubky}
                status={status}
              />
            </Content.Grid>
          </div>
          <Content.Grid className="grid grid-cols-3 gap-6">
            <PostsLayout className="flex flex-col col-span-3 xl:col-span-2 gap-6  mt-[10px]">
              <Profile.FilterTabs
                countContacts={countContacts}
                countPosts={countPosts}
                creatorPubky={creatorPubky}
                loading={loading}
              />
            </PostsLayout>
            <Profile.Sidebar creatorPubky={creatorPubky} />
          </Content.Grid>
          <CreatePost />
          <div ref={loader} />
        </>
      ) : (
        <Content.Grid>
          <div className="px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
            <Typography.Body
              variant="small"
              className="text-opacity-50 text-center"
            >
              This profile was not found or has been deleted by its author.
              <Link
                href="/home"
                className="ml-2 text-fuchsia-500 text-opacity-80 hover:text-opacity-100 cursor-pointer"
              >
                Go home
              </Link>
            </Typography.Body>
          </div>
        </Content.Grid>
      )}
    </Content.Main>
  );
}
