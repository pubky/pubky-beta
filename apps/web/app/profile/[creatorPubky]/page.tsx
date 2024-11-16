'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import * as Components from '@/components';
import { CreatePost, Header, PostsLayout } from '@/components';
import { Profile } from '../components';
import { Profile as ProfileCommon } from '../components';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import Skeletons from '@/components/Skeletons';
import { Utils } from '@social/utils-shared';

export default function Index({
  params,
}: {
  params: Promise<{ creatorPubky: string }>;
}) {
  const { pubky } = usePubkyClientContext();
  const [activeTab, setActiveTab] = useState(0);
  const [resolvedParams, setResolvedParams] = useState<{
    creatorPubky: string;
  } | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  const creatorPubky = resolvedParams?.creatorPubky || '';
  const {
    data: profile,
    isLoading,
    isError,
  } = useUserProfile(creatorPubky, pubky ?? '');
  const loader = useRef(null);
  let content;

  if (isLoading) {
    content = <Skeletons.Simple />;
  } else if (!profile && isError) {
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
  } else {
    content = (
      <>
        <div>
          <Content.Grid className="pb-4 md:pb-12 flex flex-col text-start lg:flex-row items-center gap-8 relative">
            <Profile.FilterTabsMobile
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              countContacts={{
                followers: profile?.counts?.followers ?? 0,
                following: profile?.counts?.following ?? 0,
                friends: profile?.counts?.friends ?? 0,
              }}
              countReplies={profile?.counts?.replies}
              countPosts={profile?.counts?.posts}
              loading={isLoading}
              creatorPubky={creatorPubky}
              profile={profile}
            />
            <div className="w-full rounded-2xl p-6 md:p-0 bg-white md:bg-transparent bg-opacity-10 flex flex-col text-center lg:flex-row items-center gap-8 relative">
              <ProfileCommon.Avatar
                username={
                  profile?.details?.name || Utils.minifyPubky(creatorPubky)
                }
                uriImage={
                  profile?.details?.image || '/images/webp/Userpic.webp'
                }
              />
              <ProfileCommon.Handle
                className="-mt-4"
                profile={profile}
                pubkey={creatorPubky ?? ''}
                creatorPubky={creatorPubky}
              />
            </div>
          </Content.Grid>
        </div>
        <Content.Grid className="grid grid-cols-5 gap-2">
          <PostsLayout className="flex flex-col col-span-5 xl:col-span-4 gap-3 mt-[10px]">
            <Profile.FilterTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              countContacts={{
                followers: profile?.counts?.followers ?? 0,
                following: profile?.counts?.following ?? 0,
                friends: profile?.counts?.friends ?? 0,
              }}
              countPosts={
                (profile?.counts?.posts ?? 0) - (profile?.counts?.replies ?? 0)
              }
              countReplies={profile?.counts?.replies}
              loading={isLoading}
              creatorPubky={creatorPubky}
              profile={profile}
            />
          </PostsLayout>
          <Profile.Sidebar creatorPubky={creatorPubky} />
        </Content.Grid>
        <CreatePost />
        <Components.FooterMobile />
        <div ref={loader} />
      </>
    );
  }

  return (
    <Content.Main>
      <Header className="hidden md:block" />
      {content}
    </Content.Main>
  );
}
