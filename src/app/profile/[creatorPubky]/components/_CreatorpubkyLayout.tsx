'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Content, Typography } from '@social/ui-shared';
import * as Components from '@/components';
import { CreatePost, PostsLayout } from '@/components';
import { Profile } from '../../components';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import Skeletons from '@/components/Skeletons';
import { Utils } from '@social/utils-shared';
import { usePathname } from 'next/navigation';
import { Header } from './_Header';
import { ImageByUri } from '@/components/ImageByUri';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function CreatorpubkyLayout({
  params,
  children
}: {
  params: Promise<{ creatorPubky: string }>;
  children: React.ReactNode;
}) {
  const { pubky } = usePubkyClientContext();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{
    creatorPubky: string;
  } | null>(null);

  const shouldShowAvatarSection = () => {
    const foundTab = Profile.FilterTabs.tabs.find((tab) => tab.id === activeTab);
    return foundTab?.key === 'tagged' || !isMobile;
  };

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  const creatorPubky = resolvedParams?.creatorPubky || '';
  const { data: profile, isLoading, isError } = useUserProfile(creatorPubky, pubky ?? '');
  const loader = useRef(null);
  let content;

  useEffect(() => {
    setLoading(true);
    const pathSegments = pathname?.split('/');
    const lastSegment = pathSegments?.pop();
    const key = creatorPubky && lastSegment === creatorPubky ? 'posts' : lastSegment;
    const foundTab = Profile.FilterTabs.tabs.find((tab) => tab.key === key);
    setActiveTab(foundTab ? foundTab.id : 0);
    setLoading(false);
  }, [pathname, creatorPubky]);

  if (isLoading) {
    content = <Skeletons.Simple />;
  } else if (!profile && isError) {
    content = (
      <Content.Grid>
        <div className="px-6 py-2 bg-white bg-opacity-10 rounded-2xl">
          <Typography.Body variant="small" className="text-opacity-50 text-center">
            This profile was not found or has been deleted by its author.
            <Link href="/home" className="ml-2 text-white text-opacity-80 hover:text-opacity-100 cursor-pointer">
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
          <Content.Grid className="pb-4 flex flex-col text-start lg:flex-row items-center gap-4 md:gap-8 relative">
            <Profile.FilterTabsMobile
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userCounts={profile?.counts}
              loading={loading}
              setLoading={setLoading}
              creatorPubky={creatorPubky}
            />
            {shouldShowAvatarSection() && (
              <div className="w-full rounded-2xl p-6 lg:p-0 bg-white lg:bg-transparent bg-opacity-10 flex flex-col text-center lg:flex-row items-center gap-3 lg:gap-14 relative">
                {profile?.details?.id && (
                  <Profile.Avatar
                    id={profile?.details?.id}
                    isCensored={Utils.isProfileCensored(profile)}
                    className="lg:pl-12 cursor-pointer"
                    username={profile?.details?.name || Utils.minifyPubky(creatorPubky)}
                    onClick={() => setIsAvatarOpen(true)}
                  />
                )}
                <Profile.Handle
                  className="md:pt-5"
                  profileUser={profile}
                  pubkey={creatorPubky ?? ''}
                  creatorPubky={creatorPubky}
                />
              </div>
            )}
          </Content.Grid>
        </div>
        <Content.Grid className="grid grid-cols-6 gap-2 lg:mt-6">
          <PostsLayout className="flex flex-col col-span-6 xl:col-span-5 gap-3 mt-[10px]">
            <Profile.FilterTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loading={loading}
              setLoading={setLoading}
              userCounts={profile?.counts}
              creatorPubky={creatorPubky}
            >
              {children}
            </Profile.FilterTabs>
          </PostsLayout>
          <Profile.Sidebar creatorPubky={creatorPubky} activeTab={activeTab} />
        </Content.Grid>
        <CreatePost />
        <Components.FooterMobile />
        <div ref={loader} />
        {isAvatarOpen && (
          <div
            onClick={() => setIsAvatarOpen(false)}
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
          >
            <div onClick={(event) => event?.stopPropagation()} className="relative p-4 bg-transparent rounded-full">
              <ImageByUri
                id={profile?.details?.id}
                isCensored={Utils.isProfileCensored(profile)}
                alt={profile?.details?.name || Utils.minifyPubky(creatorPubky)}
                width={362}
                height={362}
                className="rounded-full shadow-[0px_20px_40px_0px_rgba(5,5,10,0.50)]"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Content.Main>
      <Header />
      {content}
    </Content.Main>
  );
}
