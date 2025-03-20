'use client';

import { useEffect } from 'react';
import { Typography, Post as PostUI, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { Post as PostComponent } from '@/components';
import { ImageByUri } from '@/components/ImageByUri';
import { Post } from '.';

import { useUserProfile } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';

import { usePubkyClientContext } from '@/contexts';
import Link from 'next/link';
import Tags from '@/components/Post/Tags';
import { PubkyAppPostKind } from 'pubky-app-specs';
import { ImageArticle } from './_ImageArticle';

export function ValidPostContent({ postRef, data }) {
  const { pubky } = usePubkyClientContext();
  const user = useUserProfile(data?.details?.author, pubky ?? '');

  const { setSinglePost, singlePost } = usePubkyClientContext();

  useEffect(() => {
    setSinglePost(data);

    return () => {
      setSinglePost(undefined);
    };
  }, [data]);

  if (!singlePost) return null;

  return (
    <>
      {singlePost?.relationships?.replied && (
        <Post.RootParent postRef={postRef} parentURI={singlePost?.relationships?.replied} />
      )}

      <div ref={postRef} key={singlePost?.details?.uri}>
        {String(singlePost?.details?.kind) === PubkyAppPostKind[1].toLocaleLowerCase() ? (
          <LongPost data={singlePost} user={user} />
        ) : (
          <NormalPost data={singlePost} />
        )}
      </div>
      <div className="mt-3">
        <Post.PostRoot uri={singlePost?.details.id} post={singlePost} />
      </div>
    </>
  );
}

const NormalPost = ({ data }) => {
  const isMobile = useIsMobile();
  const lineBaseCSS = `ml-[10px] absolute border-l-[1px] h-[52%] -top-3 border-[#444447]`;

  return (
    <div className="flex items-center relative">
      {data?.relationships?.replied && (
        <>
          <div className={lineBaseCSS} />
          <div className="absolute ml-[10px]">
            <Icon.LineHorizontal size="14" color="#444447" />
          </div>
        </>
      )}
      <PostComponent
        key={data?.details?.uri}
        post={data}
        size="full"
        fullContent
        largeView={!isMobile}
        className={data?.relationships?.replied ? 'ml-6' : ''}
        postType={'single'}
      />
    </div>
  );
};

const LongPost = ({ data, user }) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-auto lg:w-[1200px] flex flex-col gap-4">
        <Typography.Display className="sm:leading-[64px] break-all">
          {JSON.parse(data?.details?.content).title}
        </Typography.Display>
        <div className="flex w-full gap-4 justify-between items-center">
          <div className="justify-start gap-3 flex items-center mt-4 mb-2">
            <ImageByUri
              id={user?.data?.details.id}
              width={48}
              height={48}
              className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full"
              alt="user-image"
            />
            <Link
              className="cursor-pointer flex flex-col md:flex-row md:gap-4 md:items-center"
              href={`/profile/${data?.details?.author}`}
            >
              <Typography.Body className={`text-2xl hover:underline hover:decoration-solid`} variant="medium-bold">
                {Utils.minifyText(user?.data?.details?.name ?? Utils.minifyPubky(data?.details?.author), 24)}
              </Typography.Body>
              <div className="flex gap-1 -mt-1 md:mt-1 cursor-pointer">
                <Typography.Label className="text-opacity-30">
                  {Utils.minifyPubky(data?.details?.author ?? '')}
                </Typography.Label>
              </div>
            </Link>
          </div>
          <PostUI.Time className="mr-2">{Utils.timeAgo(data?.details?.indexed_at, isMobile)}</PostUI.Time>
        </div>
        {data?.details?.attachments && data?.details?.attachments[0] && (
          <ImageArticle
            uri={data?.details?.attachments[0]}
            width={1200}
            height={650}
            className="w-[1200px] h-auto rounded-lg mb-4"
            alt="article-image"
          />
        )}
        <div
          className="text-white break-words"
          dangerouslySetInnerHTML={{
            __html: JSON.parse(data?.details?.content).body
          }}
        ></div>
      </div>
      <Tags.LargeView post={data} postType="single" />
    </div>
  );
};
