'use client';

import { Typography, Post as PostUI, Icon } from '@social/ui-shared';
import { Post as PostComponent } from '@/components';
import { Utils } from '@social/utils-shared';
import { Post } from '.';
import { useUserProfile } from '@/hooks/useUser';
import { usePubkyClientContext } from '@/contexts';
import { useRouter } from 'next/navigation';
import { ImageByUri } from '@/components/ImageByUri';
import TagsLargeView from '@/components/Post/_TagsLargeView';
import MarkdownPreview from '@uiw/react-markdown-preview';

// Component for Valid Post Content
export function ValidPostContent({
  postRef,
  data,
  windowWidth,
  repliesArray,
  isLoadingReplies,
  loader,
}) {
  const router = useRouter();
  const { pubky } = usePubkyClientContext();
  const user = useUserProfile(data?.details?.author, pubky ?? '');
  const lineHorizontalCSS = (
    <div className="absolute ml-[9px]">
      <Icon.LineHorizontal size="14" color="#262626" />
    </div>
  );

  return (
    <>
      {data?.relationships?.replied && (
        <Post.RootParent
          postRef={postRef}
          parentURI={data?.relationships?.replied}
        />
      )}

      <div ref={postRef}>
        <div key={data?.details?.uri}>
          {data?.details?.kind === 'Long' ? (
            <div className="flex gap-6">
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
                    <div
                      className="cursor-pointer flex flex-col md:flex-row md:gap-4 md:items-center"
                      onClick={() =>
                        router.push(`/profile/${data?.details?.author}`)
                      }
                    >
                      <Typography.Body
                        className={`text-2xl hover:underline hover:decoration-solid`}
                        variant="medium-bold"
                      >
                        {Utils.minifyText(
                          user?.data?.details?.name ??
                            Utils.minifyPubky(data?.details?.author),
                          24
                        )}
                      </Typography.Body>
                      <div className="flex gap-1 -mt-1 md:mt-1 cursor-pointer">
                        {/**<Icon.CheckCircle size="16" color="gray" />*/}
                        <Typography.Label className="text-opacity-30">
                          {Utils.minifyPubky(data?.details?.author ?? '')}
                        </Typography.Label>
                      </div>
                    </div>
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
                <ImageByUri
                  width={1000}
                  height={650}
                  className="w-[1200px] h-auto max-h-[500px] rounded-lg mb-4"
                  alt="article-image"
                  uri={data?.details?.attachments[0] ?? ''}
                  loading
                />
                <div className="text-white break-words">
                  <MarkdownPreview
                    source={JSON.parse(data?.details?.content).body}
                  />
                </div>
              </div>
              {windowWidth >= 1280 && <TagsLargeView post={data} />}
            </div>
          ) : (
            <div className="flex items-center relative">
              {data?.relationships?.replied && (
                <>
                  <div
                    className={`ml-[9px] absolute border-l-2 h-[52%] -top-3 border-neutral-800`}
                  />
                  {lineHorizontalCSS}
                </>
              )}
              <PostComponent
                key={data?.details?.uri}
                post={data}
                size="full"
                largeView={windowWidth >= 1280}
                fullContent
                className={data?.relationships?.replied ? 'ml-6' : ''}
                //line={Boolean(data?.relationships?.replied)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mt-3">
        <Post.ReplyForm
          uri={data?.details.id}
          post={data}
          updatePost={() => console.log('updated')}
          replies={repliesArray}
          isLoadingReplies={isLoadingReplies}
        />
        <div ref={loader} />
      </div>
    </>
  );
}
