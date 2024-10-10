'use client';

import { twMerge } from 'tailwind-merge';
import {
  Button,
  Icon,
  Post as PostUI,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';

import { TLayouts, TSize } from '@/types';
import Tags from './_Tags';
import Actions from './_Actions';
import Header from './_Header';
import Content from './_Content';
import { useRouter } from 'next/navigation';
import { Utils } from '@social/utils-shared';
import { useEffect, useState } from 'react';
import Tooltip from '../Tooltip';
import { usePubkyClientContext } from '@/contexts';
import TagsLargeView from './_TagsLargeView';
import { PostView } from '@/types/Post';
import { useUserProfile } from '@/hooks/useUser';
import { getPost } from '@/services/postService';
import { Skeleton } from '..';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repostView?: boolean;
  largeView?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: PostView;
  layout?: TLayouts;
  fullContent?: boolean;
  line?: boolean;
  lineStyle?: string;
}

export default function Post({
  repostView = false,
  largeView = false,
  size = 'full',
  post,
  layout,
  fullContent = false,
  line,
  lineStyle,
  ...rest
}: PostProps) {
  const { pubky } = usePubkyClientContext();
  //const { setContent, setShow } = useAlertContext();
  const { data } = useUserProfile(post?.details.author, pubky ?? '');
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const [repostedPost, setRepostedPost] = useState<PostView>();
  const [loadingRepostedPost, setLoadingRepostedPost] = useState(true);
  const router = useRouter();
  const lineBaseCSS = `absolute border-l-2 h-full border-neutral-800 after:content-[' * '] after:bg-neutral-800 after:w-[2px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS =
    'absolute ml-[1px] w-3.5 border-t-2 border-neutral-800';

  //const handleDeletePost = async () => {
  //  const result = null; //await deletePost(post?.id);
  //  if (result) {
  //    setContent('Post deleted successfully');
  //    setShow(true);
  //  } else {
  //    setContent('Something wrong. Try again', 'warning');
  //    setShow(true);
  //  }
  // };

  const fetchRepostedPost = async () => {
    if (post?.relationships?.reposted) {
      if (post?.relationships?.reposted) {
        const url = post.relationships.reposted;

        const regex =
          /pubky:\/\/([a-zA-Z0-9]+)\/pub\/pubky\.app\/posts\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);

        if (match) {
          const authorId = match[1];
          const postId = match[2];

          const result = await getPost(authorId, postId, pubky ?? '');
          setRepostedPost(result);
          setLoadingRepostedPost(false);
        } else {
          console.error('URI reposted not valid');
          setLoadingRepostedPost(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchRepostedPost();
  }, [post?.relationships?.reposted]);

  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => router.push(Utils.encodePostUri(post?.details?.uri))}
    >
      <div className="flex flex-col">
        <PostUI.Root>
          <div>
            {post?.relationships?.reposted && !repostView ? (
              post?.details?.content || post?.files ? (
                <PostUI.MainCard
                  className={twMerge(
                    largeView && 'p-12 inline-flex flex-row gap-12',
                    rest.className
                  )}
                >
                  <div className="flex-col justify-between inline-flex">
                    <Header post={post} largeView={largeView} />
                    <div>
                      <Content
                        largeView={largeView}
                        post={post}
                        fullContent={fullContent}
                      />
                      {loadingRepostedPost ? (
                        <Skeleton.Simple />
                      ) : post?.relationships?.reposted && repostedPost ? (
                        <>
                          {/** Show reposted post*/}

                          <PostUI.MainCard
                            onClick={(event) => {
                              event.stopPropagation();
                              router.push(
                                Utils.encodePostUri(repostedPost?.details?.uri)
                              );
                            }}
                            className="mt-4"
                          >
                            <Header post={repostedPost} />
                            {line && (
                              <div
                                className={twMerge(lineBaseCSS, lineStyle)}
                              />
                            )}
                            <div>
                              <Content
                                post={repostedPost}
                                fullContent={fullContent}
                              />
                            </div>
                          </PostUI.MainCard>
                        </>
                      ) : (
                        <div className="px-6 py-2 bg-white bg-opacity-10 rounded-2xl mt-2">
                          <Typography.Body
                            variant="small"
                            className="text-opacity-50"
                          >
                            This post was not found or has been deleted by its
                            author.
                          </Typography.Body>
                        </div>
                      )}
                      <div
                        className={`flex flex-col md:flex-row ${
                          largeView ? 'gap-2' : 'justify-between'
                        }`}
                      >
                        {!repostView && (
                          <Tags largeView={largeView} post={post} />
                        )}
                        {!repostView && <Actions post={post} />}
                      </div>
                    </div>
                  </div>
                  {largeView && <TagsLargeView post={post} />}
                </PostUI.MainCard>
              ) : (
                <>
                  <PostUI.RepostCard className="relative z-10 hover:z-50">
                    <div className="flex gap-2 items-center">
                      <Button.Action
                        className="bg-black bg-opacity-100 hover:bg-opacity-100 cursor-default"
                        size="small"
                        variant="custom"
                        icon={<Icon.Repost size="16" />}
                      />
                      <TooltipUI.Root
                        delay={500}
                        tagId="1"
                        setShowTooltip={setShowTooltipProfile}
                      >
                        <PostUI.Username
                          className="text-[13px] text-opacity-80"
                          onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/profile/${post?.details?.author}`);
                          }}
                        >
                          <span className="cursor-pointer hover:underline hover:decoration-solid">
                            {data?.details?.name &&
                              Utils.minifyText(data?.details?.name)}{' '}
                          </span>
                          reposted{' '}
                        </PostUI.Username>
                        {showTooltipProfile !== '' && (
                          <Tooltip.Profile post={post} />
                        )}
                      </TooltipUI.Root>
                      {(!post?.details?.content ||
                        !post?.relationships?.reposted) &&
                        post?.details?.author === pubky && (
                          <Typography.Body
                            variant="small-bold"
                            className="cursor-default text-[13px] text-red-500 text-opacity-50 underline decoration-solid"
                            //onClick={handleDeletePost}
                          >
                            Undo repost
                          </Typography.Body>
                        )}
                    </div>
                    <PostUI.Time>
                      {Utils.timeAgo(post?.details?.indexed_at)}
                    </PostUI.Time>
                  </PostUI.RepostCard>
                  {loadingRepostedPost ? (
                    <Skeleton.Simple />
                  ) : post?.relationships?.reposted && repostedPost ? (
                    <>
                      {/**Show reposted post */}
                      <PostUI.MainCard
                        className={twMerge(
                          'rounded-tl-none rounded-tr-none',
                          largeView && 'p-12 inline-flex flex-row gap-12',
                          rest.className
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          router.push(
                            Utils.encodePostUri(repostedPost?.details?.uri)
                          );
                        }}
                      >
                        <div className="flex-col justify-between inline-flex">
                          <Header post={repostedPost} largeView={largeView} />
                          {line && (
                            <div className={twMerge(lineBaseCSS, lineStyle)} />
                          )}
                          <div>
                            <Content
                              largeView={largeView}
                              post={repostedPost}
                              fullContent={fullContent}
                            />
                            <div
                              className={`flex flex-col md:flex-row ${
                                largeView ? 'gap-2' : 'justify-between'
                              }`}
                            >
                              {!repostView && (
                                <Tags largeView={largeView} post={post} />
                              )}
                              {!repostView && <Actions post={post} />}
                            </div>
                          </div>
                        </div>
                        {largeView && <TagsLargeView post={post} />}
                      </PostUI.MainCard>
                    </>
                  ) : (
                    <>
                      <div className="mx-[47px] px-6 py-2 bg-white bg-opacity-10 rounded-2xl mt-2">
                        <Typography.Body
                          variant="small"
                          className="text-opacity-50"
                        >
                          This post was not found or has been deleted by its
                          author.
                        </Typography.Body>
                      </div>
                      <div className="border-0 border-b-[1px] border-white border-opacity-10 mt-6" />
                    </>
                  )}
                </>
              )
            ) : (
              <div className="flex items-center relative">
                {line && (
                  <>
                    <div className={twMerge(lineBaseCSS, lineStyle)} />
                    <div className={twMerge(lineHorizontalCSS)} />
                  </>
                )}
                <PostUI.MainCard
                  className={twMerge(
                    line && 'ml-6',
                    largeView && 'p-12 flex inline-flex flex-row gap-12',
                    rest.className
                  )}
                >
                  <div className="flex-col justify-between inline-flex">
                    <Header
                      post={post}
                      largeView={largeView}
                      repostView={repostView}
                    />
                    <div>
                      <Content
                        largeView={largeView}
                        post={post}
                        fullContent={fullContent}
                      />
                      <div
                        className={`flex flex-col md:flex-row ${
                          largeView ? 'gap-2' : 'justify-between'
                        }`}
                      >
                        {!repostView && (
                          <Tags largeView={largeView} post={post} />
                        )}
                        {!repostView && <Actions post={post} />}
                      </div>
                    </div>
                  </div>
                  {largeView && <TagsLargeView post={post} />}
                </PostUI.MainCard>
              </div>
            )}
          </div>
        </PostUI.Root>
      </div>
    </div>
  );
}
