'use client';

import { Icon, Post as PostUI, Tooltip as TooltipUI } from '@social/ui-shared';

import { IPost, TLayouts, TSize } from '../../types';
import Tags from './_Tags';
import Actions from './_Actions';
import Header from './_Header';
import Content from './_Content';
import { useRouter } from 'next/navigation';
import { Utils } from '../../utils';
import { useState } from 'react';
import Tooltip from '../Tooltip';
import { useClientContext } from '../../contexts/client';

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {
  repostView?: boolean;
  bookmark?: boolean;
  size?: TSize;
  post: IPost;
  layout?: TLayouts;
  fullContent?: boolean;
}

export default function Post({
  repostView = false,
  size = 'full',
  post,
  layout,
  fullContent = true,
  ...rest
}: PostProps) {
  const { pubky } = useClientContext();
  const [showTooltipProfile, setShowTooltipProfile] = useState('');
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <PostUI.Root>
          <div>
            {post?.post.embed && !repostView ? (
              post?.post.content ? (
                <PostUI.MainCard className={rest.className}>
                  <Header post={post} />
                  <div className="ml-[47px]">
                    <Content post={post} fullContent={fullContent} />
                    <PostUI.MainCard className="p-4 border rounded-lg mt-4">
                      <Header post={post?.post?.embed?.post} repostView />
                      <div className="ml-[47px]">
                        <Content
                          post={post?.post?.embed?.post}
                          fullContent={fullContent}
                        />
                      </div>
                    </PostUI.MainCard>
                    <div className="flex flex-col md:flex-row justify-between">
                      {!repostView && <Tags post={post} />}
                      <div className="grow" />
                      {!repostView && <Actions post={post} />}
                    </div>
                  </div>
                </PostUI.MainCard>
              ) : (
                <>
                  <PostUI.RepostCard>
                    <Icon.Repost size="16" />
                    <TooltipUI.Root
                      delay={200}
                      tagId="1"
                      setShowTooltip={setShowTooltipProfile}
                    >
                      <PostUI.Username
                        className="text-[13px] text-opacity-80 cursor-pointer hover:underline hover:decoration-solid z-10"
                        onClick={() =>
                          router.push(`/profile/${post?.author.id}`)
                        }
                      >
                        {Utils.minifyText(post?.author?.profile?.name)} reposted
                      </PostUI.Username>
                      {showTooltipProfile !== '' && (
                        <Tooltip.Profile post={post} />
                      )}
                    </TooltipUI.Root>
                  </PostUI.RepostCard>
                  <PostUI.MainCard className={rest.className}>
                    <Header post={post?.post?.embed?.post} />
                    <div className="ml-[47px]">
                      <Content
                        post={post?.post?.embed?.post}
                        fullContent={fullContent}
                      />
                      <div className="flex flex-col md:flex-row justify-between">
                        {!repostView && <Tags post={post?.post?.embed?.post} />}
                        <div className="grow" />
                        {!repostView && (
                          <Actions
                            post={post?.post?.embed?.post}
                            repostId={post?.id}
                            deleteRepost={post?.author.id === pubky}
                          />
                        )}
                      </div>
                    </div>
                  </PostUI.MainCard>
                </>
              )
            ) : (
              <PostUI.MainCard className={rest.className}>
                <Header post={post} repostView={repostView} />
                <div className="ml-[47px]">
                  <Content post={post} fullContent={fullContent} />
                  <div className="flex flex-col md:flex-row justify-between">
                    {!repostView && <Tags post={post} />}
                    <div className="grow" />
                    {!repostView && <Actions post={post} />}
                  </div>
                </div>
              </PostUI.MainCard>
            )}
          </div>
        </PostUI.Root>
      </div>
    </div>
  );
}
