'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';

import { Typography, Post as PostUI, Icon } from '@social/ui-shared';
import { Utils } from '@social/utils-shared';
import { Post as PostComponent } from '@/components';
import { ImageByUri } from '@/components/ImageByUri';
import TagsLargeView from '@/components/Post/_TagsLargeView';
import { Post } from '.';

import { useUserProfile } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';

import { usePubkyClientContext } from '@/contexts';
import Link from 'next/link';

export function ValidPostContent({ postRef, data }) {
  const { pubky } = usePubkyClientContext();
  const user = useUserProfile(data?.details?.author, pubky ?? '');

  return (
    <>
      {data?.relationships?.replied && (
        <Post.RootParent
          postRef={postRef}
          parentURI={data?.relationships?.replied}
        />
      )}

      <div ref={postRef} key={data?.details?.uri}>
        {data?.details?.kind === 'long' ? (
          <LongPost data={data} user={user} />
        ) : (
          <NormalPost data={data} />
        )}
      </div>
      <div className="mt-3">
        <Post.PostRoot
          uri={data?.details.id}
          post={data}
          updatePost={() => console.log('updated')}
        />
      </div>
    </>
  );
}

const NormalPost = ({ data }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center relative">
      {data?.relationships?.replied && (
        <>
          <div
            className={`ml-[9px] absolute border-l-2 h-[52%] -top-3 border-neutral-800`}
          />
          <div className="absolute ml-[9px]">
            <Icon.LineHorizontal size="14" color="#262626" />
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
      />
    </div>
  );
};

const LongPost = ({ data, user }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex flex-col gap-4">
        <Typography.Display className="sm:leading-[64px]">
          {JSON.parse(data?.details?.content).title}
        </Typography.Display>
        <div className="flex w-full gap-4 justify-between items-center">
          <div className="justify-start gap-3 flex items-center mt-4 mb-2">
            <ImageByUri
              width={48}
              height={48}
              className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-full"
              alt="user-image"
              uri={user?.data?.details?.image}
            />
            <Link
              className="cursor-pointer flex flex-col md:flex-row md:gap-4 md:items-center"
              href={`/profile/${data?.details?.author}`}
            >
              <Typography.Body
                className={`text-2xl hover:underline hover:decoration-solid`}
                variant="medium-bold"
              >
                {Utils.minifyText(
                  user?.data?.details?.name ??
                    Utils.minifyPubky(data?.details?.author),
                  24,
                )}
              </Typography.Body>
              <div className="flex gap-1 -mt-1 md:mt-1 cursor-pointer">
                <Typography.Label className="text-opacity-30">
                  {Utils.minifyPubky(data?.details?.author ?? '')}
                </Typography.Label>
              </div>
            </Link>
          </div>
          <PostUI.Time className="mr-2">
            <span className="hidden md:flex">
              {Utils.timeAgo(data?.details?.indexed_at)}
            </span>
            <span className="md:hidden">
              {Utils.timeAgo(data?.details?.indexed_at, true)}
            </span>
          </PostUI.Time>
        </div>
        {data?.details?.attachments[0] && (
          <ImageByUri
            width={1200}
            height={650}
            className="w-[1200px] h-auto rounded-lg mb-4"
            alt="article-image"
            uri={data?.details?.attachments[0] ?? ''}
            loading
          />
        )}
        <div className="text-white break-words">
          <MarkdownPreview source={JSON.parse(data?.details?.content).body} />
        </div>
      </div>
      <TagsLargeView post={data} />
    </div>
  );
};
