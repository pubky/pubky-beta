'use client';

import { twMerge } from 'tailwind-merge';
import {
  Button,
  Icon,
  Post as PostUI,
  Tooltip as TooltipUI,
  Typography,
} from '@social/ui-shared';

import { IPost, TLayouts, TSize } from '@/types';
import Tags from './_Tags';
import Actions from './_Actions';
import Header from './_Header';
import Content from './_Content';
import { useRouter } from 'next/navigation';
import { Utils } from '@social/utils-shared';
import { useState } from 'react';
import Tooltip from '../Tooltip';
import { useClientContext, useAlertContext } from '@/contexts';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repostView?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: IPost;
  layout?: TLayouts;
  fullContent?: boolean;
  line?: boolean;
  lineStyle?: string;
}

export default function Post({
  repostView = false,
  size = 'full',
  post,
  layout,
  fullContent = false,
  line,
  lineStyle,
  ...rest
}: PostProps) {
  const { pubky, deletePost } = useClientContext();
  const { setContent, setShow } = useAlertContext();
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const router = useRouter();
  const lineBaseCSS = `absolute border-l-2 h-full border-neutral-800 after:content-[' '] after:bg-neutral-800 after:w-[2px] after:h-[12px] after:block after:-mt-[12px] after:-ml-[2px]`;
  const lineHorizontalCSS =
    'absolute ml-[1px] w-3.5 border-t-2 border-neutral-800';

  const handleDeletePost = async () => {
    const result = await deletePost(post?.id);
    if (result) {
      setContent('Post deleted successfully');
      setShow(true);
    } else {
      setContent('Something wrong. Try again', 'warning');
      setShow(true);
    }
  };

  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => router.push(Utils.encodePostUri(post?.uri))}
    >
      <div className="flex flex-col">
        <PostUI.Root>
          <div>
            {post?.post.embed && !repostView ? (
              post?.post.content ? (
                <PostUI.MainCard className={rest.className}>
                  <Header post={post} />
                  <div>
                    <Content post={post} fullContent={fullContent} />
                    {post?.post.embed.post ? (
                      <PostUI.MainCard className="mt-4">
                        <Header post={post?.post?.embed?.post} />
                        {line && (
                          <div className={twMerge(lineBaseCSS, lineStyle)} />
                        )}
                        <div>
                          <Content
                            post={post?.post?.embed?.post}
                            fullContent={fullContent}
                          />
                        </div>
                      </PostUI.MainCard>
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
                    <div className="flex flex-col md:flex-row justify-between">
                      {!repostView && <Tags post={post} />}
                      <div className="grow" />
                      {!repostView && <Actions post={post} />}
                    </div>
                  </div>
                </PostUI.MainCard>
              ) : (
                <>
                  <PostUI.RepostCard
                    className="relative z-10 hover:z-50"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex gap-2 items-center">
                      <Button.Action
                        className="bg-black bg-opacity-100 hover:bg-opacity-100 cursor-default"
                        size="small"
                        variant="custom"
                        icon={<Icon.Repost size="16" />}
                      />
                      <TooltipUI.Root
                        delay={200}
                        tagId="1"
                        setShowTooltip={setShowTooltipProfile}
                      >
                        <PostUI.Username
                          className="text-[13px] text-opacity-80 cursor-pointer hover:underline hover:decoration-solid"
                          onClick={() =>
                            router.push(`/profile/${post?.author.id}`)
                          }
                        >
                          {Utils.minifyText(post?.author?.profile?.name)}{' '}
                          reposted{' '}
                        </PostUI.Username>
                        {showTooltipProfile !== '' && (
                          <Tooltip.Profile post={post} />
                        )}
                      </TooltipUI.Root>
                      {(!post?.post.content || !post?.post.embed.post) &&
                        post?.author.id === pubky && (
                          <Typography.Body
                            variant="small-bold"
                            className="cursor-pointer text-[13px] text-red-500 text-opacity-80 hover:text-opacity-100 underline decoration-solid"
                            onClick={handleDeletePost}
                          >
                            Undo repost
                          </Typography.Body>
                        )}
                    </div>
                    <PostUI.Time>{Utils.timeAgo(post?.createdAt)}</PostUI.Time>
                  </PostUI.RepostCard>
                  {post?.post.embed.post ? (
                    <PostUI.MainCard
                      className={twMerge(
                        'rounded-tl-none rounded-tr-none',
                        rest.className
                      )}
                    >
                      <Header post={post?.post?.embed?.post} />
                      {line && (
                        <div className={twMerge(lineBaseCSS, lineStyle)} />
                      )}
                      <div>
                        <Content
                          post={post?.post?.embed?.post}
                          fullContent={fullContent}
                        />
                        <div className="flex flex-col md:flex-row justify-between">
                          {!repostView && (
                            <Tags post={post?.post?.embed?.post} />
                          )}
                          <div className="grow" />
                          {!repostView && (
                            <Actions
                              post={post?.post?.embed?.post}
                              repost={post}
                              deleteRepost={post?.author.id === pubky}
                            />
                          )}
                        </div>
                      </div>
                    </PostUI.MainCard>
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
                  className={twMerge(line && 'ml-[15px]', rest.className)}
                >
                  <Header post={post} />
                  <div>
                    <Content post={post} fullContent={fullContent} />
                    <div className="flex flex-col md:flex-row justify-between">
                      {!repostView && <Tags post={post} />}
                      <div className="grow" />
                      {!repostView && <Actions post={post} />}
                    </div>
                  </div>
                </PostUI.MainCard>
              </div>
            )}
          </div>
        </PostUI.Root>
      </div>
    </div>
  );
}
